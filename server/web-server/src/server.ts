import express, { Express, Request, Response } from 'express';
const { EventEmitter } = require('events');

const app: Express = express();
const port: number = 3000;

export const dataEmitter = new EventEmitter();

app.use(express.json());

app.post('/words', (req: Request, res: Response) => {
  console.log('Received data:', req.body);
  const data = req.body;
  dataEmitter.emit('newData', data);
  res.status(201).send({ message: 'Words created successfully', data: req.body });
});

app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});
