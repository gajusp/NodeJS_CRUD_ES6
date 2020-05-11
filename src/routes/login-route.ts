import * as express from "express";
import { Response } from "express";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import Users from '../model/users-model';

export class LoginRoute {

  loginRouter = express.Router();

  public routes() {

    this.loginRouter.get('/users', (req: any, res: Response) => {
      const query = req.query;

      Users.find(query, (err: any, users: any) => {
        if (err) {
          return res.send(err);
        }

        const userList = users.map((user: any) => user.name);;

        return res.json(userList);
      });
    });

    this.loginRouter.get('/userDetails', this.authenticateToken, async (req: any, res: Response) => {

      const foundUser = await Users.findOne({ name: req.user }, (err: any, user: any) => {
        if (err) {
          return res.send(err);
        }

        return user;
      });

      if (foundUser) {
        return res.status(200).json({ id: foundUser._id, name: foundUser.name });
      }
      return res.status(500).send({ message: 'Something went wrong' });
    });

    this.loginRouter.post('/signup', async (req: any, res: Response) => {

      const { name, password } = req.body;
      const foundUser = await Users.findOne({ name })

      if (foundUser) {
        return res.status(403).json({ error: 'User already created' })
      }

      try {
        const slat = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, slat);
        console.log('slat --- ' + slat, ' hashPassword ---' + hashPassword);
        const user = new Users({
          name: name,
          password: hashPassword
        });
        await user.save();

        return res.status(201).send({ status: 'User created', user: { name: user.name } });
      } catch (error) {
        res.status(500).send(`${error} - Server error`);
      }
    });

    this.loginRouter.post('/login', async (req: any, res: Response) => {

      const foundUser = await Users.findOne({ name: req.body.name }, (err: any, user: any) => {
        return user;
      });

      if (foundUser === null) {
        return res.status(403).send('Cannot find user');
      }

      try {
        if (await bcrypt.compare(req.body.password, foundUser.password)) {
          const accessToken = this.generateToken(foundUser.name);
          const refreshToken = jwt.sign(foundUser.name, process.env.REFRESH_TOKEN_SECRET);
          return res.send({ accessToken: accessToken, refreshToken: refreshToken, user: foundUser.name });
        } else {
          return res.send({ message: 'Login failed...' });
        }
      } catch (error) {
        res.status(500).send({ error: `Server error - ${error}` });
      }
    });

    return this.loginRouter;
  }

  private generateToken(userName: string) {
    return jwt.sign(userName, process.env.ACCESS_TOKEN_SECRET);
  }

  private authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).send({ message: 'Required token' })
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        res.status(403).send({ message: 'Invalid token' })
      }
      req.user = user;
      next();
    });
  }

}