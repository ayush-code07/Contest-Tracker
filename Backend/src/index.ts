// performing Type Annotation.
// if we write normally like in js, then req and res were implicitly typed as any 
// (or inferred by Express)
import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import cors from 'cors';
import contestRoutes from "./routes/contestRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

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


app.get('/', (req: Request, res: Response) => {
    res.json({
        message: "Contest Tracker Backend is running with TypeScript!"
    })
})

app.use('/contests', contestRoutes);

app.listen(PORT, () => {
    console.log(`[Server]: Server is running on http://localhost:${PORT}`);
});
