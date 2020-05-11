import * as express from "express";
import { Response } from "express";
import { BookController } from '../controller/book-controller';
import Book from '../model/book-model';

export class BookRoutes {

  bookRouter = express.Router();
  bookController: BookController = new BookController();

  public routes() {
    this.bookRouter.route('/books')
      .get(this.bookController.get)
      .post(this.bookController.post);

    // Middleware API (Client->Req->Middleware->Req->Route(Server)->Res->Client)
    this.bookRouter.use('/books/:bookId', (req: any, res: Response, next: any) => {
      Book.findById(req.params.bookId, (err: any, book) => {
        if (err) {
          return res.send(err);
        }

        if (book) {
          req.book = book;
          return next();
        }
        return res.sendStatus(404);
      });
    });

    this.bookRouter.route('/books/:bookId')
      .get(this.bookController.getItemByProp)
      .put(this.bookController.put)
      .patch(this.bookController.patch)
      .delete(this.bookController.delete);

    return this.bookRouter;
  }
}
