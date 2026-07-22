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

export interface APIResponse {
    success: boolean;
    count: number;
    data: Contest[];
}