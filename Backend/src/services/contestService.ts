import axios from "axios";
import { CodeforcesResponse, LeetCodeResponse, CodeChefResponse, Contest, CodeforcesContest, CodeChefContest } from "../types/contest.js";
import { promises } from "node:dns";
import { start } from "node:repl";

export class ContestService {
    // by using STATIC here i can easily use this class in my controller file without creating any objects
    private static CF_API_URL = "https://codeforces.com/api/contest.list?gym=false";
    private static LC_API_URL = "https://leetcode.com/graphql/";
    private static CC_API_URL = "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&limit=100"

    public static async fetchCodeforces(): Promise<Contest[]> {
        try {
            const response = await axios.get<CodeforcesResponse>(this.CF_API_URL);

            const data = response.data;

            if (data.status !== "OK") {
                throw new Error(`Codeforces API error: ${data.comment} || "Unknown error"`);
            }

            const activeContests = data.result.filter((c) => c.phase !== "FINISHED");

            return activeContests.map((c) => {
                const startTimeInMilliSeconds = c.startTimeSeconds ? c.startTimeSeconds * 1000 : Date.now();
                const endTimeInMilliSeconds = startTimeInMilliSeconds + c.durationSeconds * 1000;

                let status: Contest['status'] = "UNKNOWN";
                if (c.phase === 'BEFORE') status = "UPCOMING";
                else if (c.phase === "CODING") status = "ONGOING";
                else if (c.phase === "FINISHED") status = "COMPLETED";

                return {
                    id: `CodeForces-${c.id}`,
                    name: c.name,
                    url: `https://codeforces.com/contests/${c.id}`,
                    startTime: new Date(startTimeInMilliSeconds).toISOString(),
                    endTime: new Date(endTimeInMilliSeconds).toISOString(),
                    durationSeconds: c.durationSeconds,
                    site: 'Codeforces',
                    status: status
                }
            })

        } catch (error) {
            console.error("Error Fetching Codeforces Contest: ", error);
            return [];
        }
    }

    public static async fetchLeetcode(): Promise<Contest[]> {
        const query = `
            query topTwoContests{
                topTwoContests{
                    title
                    titleSlug
                    startTime
                    duration
                }
            }
        `;

        try {
            const response = await axios.post<LeetCodeResponse>(
                this.LC_API_URL,
                {
                    query,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Referer': 'https://leetcode.com/contest/'
                    }
                }
            );

            const data = response.data?.data?.topTwoContests || [];
            const now = Date.now();

            return data.map((c) => {
                const startTimeInMilliSeconds = c.startTime * 1000;
                const endTimeInMilliSeconds = startTimeInMilliSeconds + c.duration * 1000;

                let status: Contest['status'] = "UNKNOWN";
                if (now < startTimeInMilliSeconds) {
                    status = "UPCOMING";
                }
                else if (now > endTimeInMilliSeconds) {
                    status = "COMPLETED";
                }
                else {
                    status = "ONGOING";
                }

                return {
                    id: `leetcode-${c.titleSlug}`,
                    name: c.title,
                    url: `https://leetcode.com/contest/${c.titleSlug}`,
                    startTime: new Date(startTimeInMilliSeconds).toISOString(),
                    endTime: new Date(endTimeInMilliSeconds).toISOString(),
                    durationSeconds: c.duration,
                    site: 'LeetCode',
                    status: status
                }
            });
        } catch (error) {
            console.error("Error Fetching Leetcode Contests: ", error);
            return [];
        }
    }

    public static async fetchCodechef(): Promise<Contest[]> {
        try {
            const response = await axios.get<CodeChefResponse>(this.CC_API_URL);

            const data = response.data;

            if (data.status === "error") {
                throw new Error(`CodeChef API error: ${data.message || "Unknown error"}`);
            }
            const futureContests = data.future_contests || [];
            const presentContests = data.present_contests || [];

            const allContests = [...futureContests, ...presentContests];

            const mapContest = (c: CodeChefContest, isOngoing: boolean): Contest => {
                const durationMinutes = parseInt(c.contest_duration, 10) || 0;

                return {
                    id: `CodeChef-${c.contest_code}`,
                    name: c.contest_name,
                    url: `https:codechef.com/${c.contest_code}`,
                    startTime: c.contest_start_date_iso,
                    endTime: c.contest_end_date_iso,
                    durationSeconds: durationMinutes * 60,
                    site: "CodeChef",
                    status: isOngoing ? 'ONGOING' : 'UPCOMING'
                };
            }

            const mappedPresent = presentContests.map((c) => mapContest(c, true));
            const mappedFuture = futureContests.map((c) => mapContest(c, false));

            return [...mappedPresent, ...mappedFuture];
        } catch (error) {
            console.error("Error Fetching CodeChef Contests:", error);
            return [];
        }
    }

    public static async fetchUpcomingContests(): Promise<Contest[]> {
        const [cfContests, lcContests, ccContests] = await Promise.all([
            this.fetchCodeforces(),
            this.fetchLeetcode(),
            this.fetchCodechef()
        ]);

        const combined = [...cfContests, ...lcContests, ...ccContests];

        combined.sort((a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );

        return combined;
    }
}
