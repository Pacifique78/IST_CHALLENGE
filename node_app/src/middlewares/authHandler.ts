import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RequestWithUser } from 'src/types/custom';

export const authenticateJWT = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = decoded as { userId: string; email: string };
      return next();
    });
  } else {
    res.sendStatus(401);
  }
};
