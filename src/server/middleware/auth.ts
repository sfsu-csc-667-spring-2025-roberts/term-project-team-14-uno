import { Request, Response, NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // // @ts-ignore
  // if(req.session.userId !== undefined) {
  //     // @ts-ignore
  //     res.locals.user = req.session.userId;
  //     next()
  // } else {
  //     res.redirect("/login")
  // }
  next();
};

export { authMiddleware };
