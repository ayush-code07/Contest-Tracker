import axios from "axios";
import { CodeforcesResponse, Contest } from "../types/contest.js";

export class ContestService {
    // by using STATIC here i can easily use this class in my controller file without creating any objects
    private static API_URL = "https://codeforces.com/api/contest.list?gym=false";

    public static async fetchUpcomingContests(): Promise<Contest[]> {
        try {
            const response = await axios.get<CodeforcesResponse>(this.API_URL);

            const data = response.data;

            if (data.status !== "OK") {
                throw new Error(`Codeforces API error: ${data.comment} || "Unknown error"`);
            }

            const activeContests = data.result.filter((c) => c.phase !== "FINISHED");

            // a.startTimeSeconds can be undefined
            activeContests.sort((a, b) => (a.startTimeSeconds || 0) - (b.startTimeSeconds || 0));

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
            throw error;
        }
    }
}
