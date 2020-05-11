import { Request, Response } from "express";
import Book from '../model/book-model';

export class BookController {

  public get(req: Request, res: Response) {
    const query = req.query;

    Book.find(query, (err: any, books: any) => {
      if (err) {
        return res.send(err);
      }

      const returnBooks = books.map((book: any) => {
        let newBook = book.toJSON();
        newBook.link = { self: `http://${req.headers.host}/api/books/${book._id}` };
        return newBook;
      });

      return res.json(returnBooks);
    });
  }

  public post(req: any, res: Response) {
    const book = new Book(req.body);

    if (!req.body.title) {
      return res.status(400).send('Title is Required');
    }

    book.save();
    return res.status(201).json(book);
  }

  public getItemByProp(req: any, res: Response) {
    return res.json(req.book);
  }

  public put(req: any, res: Response) {
    const { book } = req;
    book.title = req.body.title;
    book.author = req.body.author;
    book.genre = req.body.genre;
    book.read = req.body.read;
    book.save();

    return res.json(book);
  }

  public patch(req: any, res: Response) {
    const { book } = req;

    if (req.body._id) {
      delete req.body._id;
    }

    Object.entries(req.body).forEach(item => {
      const key = item[0];
      const value = item[1];
      book[key] = value;
    });

    req.book.save((err: any) => {
      if (err) {
        return res.send(err);
      }
      return res.json(book);
    });
  }

  public delete(req: any, res: Response) {
    req.book.remove((err: any) => {
      if (err) {
        return res.send(err);
      }
      return res.sendStatus(204);
    })
  }
}