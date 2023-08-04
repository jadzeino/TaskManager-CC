import express, { Request, Response } from 'express';
import routers from './routes/routers';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());

// Test route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, this is Kabs Backend API!');
  });

// API Endpoints for tasks
app.use(routers);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})

export { app, server };
