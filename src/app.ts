import * as bodyParser from "body-parser";
import * as express from "express";
import * as MongoClient from 'mongoose';
import { BookRoutes } from "./routes/book-routes";
import { LoginRoute } from './routes/login-route';

require('dotenv').config();
const dbURI = 'mongodb://localhost/bookAPI';

class App {

  app: express.Application;
  db = MongoClient.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, });

  loginRoute: LoginRoute = new LoginRoute();
  bookRoute: BookRoutes = new BookRoutes();

  constructor() {
    this.app = express();
    this.config();

    // Default get api
    this.app.get('/', (req: any, res: any) => {
      res.status(200).send({ message: 'Welcome to nodemon API...!!!' });
    });

    // Login Routes
    this.app.use('/api', this.loginRoute.routes());

    // Book Routes
    this.app.use('/api', this.bookRoute.routes());
  }

  private config(): void {
    // supported the application/json type post data
    this.app.use(bodyParser.json());
    // support application /x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }
}

export default new App().app;
