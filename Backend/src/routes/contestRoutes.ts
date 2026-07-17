import { Router, Request, Response } from "express";
import { ContestService } from "../services/contestService.js";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const contests = await ContestService.fetchUpcomingContests();
        res.json({
            success: true,
            count: contests.length,
            data: contests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve Codeforces contest data. Please try again later.'
        });
    }
});

// here default means this file will export only this function to the file that imports it
export default router;
