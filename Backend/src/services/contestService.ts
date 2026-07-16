import { CodeforcesResponse, Contest } from "../types/contest.js";

export class ContestService {
    // by using STATIC here i can easily use this class in my controller file without creating any objects
    private static API_URL = "https://codeforces.com/api/contest.list?gym=false";


}