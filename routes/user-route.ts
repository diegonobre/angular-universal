import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

export class UserRoute {

  public userRoute(app: any): void {
    app.route('/user/').get((req: Request, res: Response, next: NextFunction) => {
      console.log('GET', req.url);
      User.find((err, documents) => {
        if (err) { return next(err); }
        res.json(documents);
      });
    });

    app.route('/user/:id').get((req: Request, res: Response, next: NextFunction) => {
      console.log('GET', req.url);
      User.findById(req.params.id, (err, document) => {
        if (err) { return next(err); }
        res.json(document);
      });
    });

    app.route('/user/').post((req: Request, res: Response, next: NextFunction) => {
      console.log('POST', req.url);
      console.log(req.body);
      User.create(req.body, (err, document) => {
        if (err) { return next(err); }
        res.json(document);
      });
    });

    app.route('/user/:id').put((req: Request, res: Response, next: NextFunction) => {
      console.log('PUT', req.url);
      User.findByIdAndUpdate(req.params.id, req.body, (err, document) => {
        if (err) { return next(err); }
        res.json(document);
      });
    });

    app.route('/user/:id').delete((req: Request, res: Response, next: NextFunction) => {
      console.log('DELETE', req.url);
      User.findByIdAndRemove(req.params.id, req.body, (err, document) => {
        if (err) { return next(err); }
        res.json(document);
      });
    });
  }
}
