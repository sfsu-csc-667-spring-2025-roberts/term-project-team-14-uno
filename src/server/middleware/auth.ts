import { Request, Response, NextFunction } from "express";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  if (req.session.userId && req.session.username) {
    // @ts-ignore
    res.locals.user = req.session.userId;
    next();
  } else {
    // @ts-ignore
    res.redirect("/login");
  }
  // this is for testing comment out above (middle ware will do nothing)
  // next();
};

export { authMiddleware };
