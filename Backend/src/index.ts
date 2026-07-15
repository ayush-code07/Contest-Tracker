import express, { Request, Response } from 'express';
// performing Type Annotation.
// if we write normally like in js, then req and res were implicitly typed as any 
// (or inferred by Express)

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.json({
        message: "Contest Tracker Backend is running with TypeScript!"
    })
})

app.listen(PORT, () => {
    console.log(`[Server]: Server is running on http://localhost:${PORT}`);
});
