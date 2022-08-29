import bodyParser from 'body-parser';
import express, { Express, Request, Response } from 'express';
import { router } from "./router";
export class App {
  public server: express.Application;

  constructor() {
    this.server = express();
    this.server.use(bodyParser.urlencoded({ extended: false }))
    this.server.use(bodyParser.json())
    this.server.set("view engine", "ejs");
    this.server.set("views", "cassiohcore/Views");
    this.server.use('/img', express.static(__dirname + '/public/img'));
    this.server.use(express.static(__dirname + '/public'));
    this.router();
  }

  public router() {
    this.server.use(router);
  }
}
/*  
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
}); */
