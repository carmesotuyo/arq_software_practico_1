import express, { Express, Request, Response } from 'express';
import { CustomData } from './data-structure/CustomData';

const app: Express = express();
const port: number = 3000;

export let data: CustomData = { words: [] };

app.use(express.json());

app.post('/words', (req: Request, res: Response) => {
  console.log('Received data:', req.body);
  data = req.body;
  res.status(201).send({ message: 'Words created successfully', data: req.body });
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
