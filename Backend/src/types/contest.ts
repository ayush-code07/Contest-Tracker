// Codeforces API response interface
export interface CodeforcesResponse {
    status: 'OK' | 'FAILED';
    comment?: string;
    result: CodeforcesContest[];
}

// Raw response structure from the Codeforces API
export interface CodeforcesContest {
    id: number;
    name: string;
    type: string;
    phase: 'BEFORE' | 'CODING' | 'PENDING_SYSTEM_TEST' | 'SYSTEM_TEST' | 'FINISHED';
    frozen: boolean;
    durationSeconds: number;
    startTimeSeconds?: number;
    relativeTimeSeconds?: number;
}

// LeetCode API response interface
export interface LeetCodeResponse {
    data: {
        topTwoContests: LeetCodeContest[];
    }
}

// Raw response structure from the LeetCode API
export interface LeetCodeContest {
    title: string;
    titleSlug: string;
    startTime: number;
    duration: number;
}

// CodeChef API response interface
export interface CodeChefResponse {
    status: string;
    message: string;
    present_contests: CodeChefContest[];
    future_contests: CodeChefContest[];
}

export interface CodeChefContest {
    contest_code: string;
    contest_name: string;
    contest_start_date: string;
    contest_end_date: string;
    contest_start_date_iso: string;
    contest_end_date_iso: string;
    contest_duration: string;
    distinct_users: number;
}

// Standard format for frontend
export interface Contest {
    id: string;
    name: string;
    url: string;
    startTime: string;
    endTime: string;
    durationSeconds: number;
    site: string;
    status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'UNKNOWN';
}
