// performing Type Annotation.
// if we write normally like in js, then req and res were implicitly typed as any 
// (or inferred by Express)
import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import contestRoutes from "./routes/contestRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        status: 429,
        error: 'Too many requests from this IP, please try again after 15 minutes'
    }
});

// allows any website to communicate(not that safe)
// app.use(cors());
// use this instead
const corsOptions = {
    origin: 'https://localhost:5173', // only allow this domain
    methods: ['GET', 'POST'], // only allow these method
}
app.use(cors(corsOptions));

// parsing incoming request bodies as JSON
app.use(express.json());

// using rateLimiter on all routes
app.use(limiter)

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: "Contest Tracker Backend is running with TypeScript!"
    })
})

app.use('/contests', contestRoutes);

app.listen(PORT, () => {
    console.log(`[Server]: Server is running on http://localhost:${PORT}`);
});
