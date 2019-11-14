import { Application } from 'express';
import jwt from 'jsonwebtoken';
import uuid from 'uuid';

enum VisitorType {
  Viewer = 'Viewer',
  Reporter = 'Reporter',
}

export type JwtPayload = {
  subject: string;
  visitorType: VisitorType;
};

export const verifyAuth = async (authHeader: string) => {
  const token = authHeader.split('Bearer ')[1];
  const visitor: JwtPayload = await new Promise<JwtPayload>(
    (resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        err ? reject(err) : resolve(payload as JwtPayload);
      });
    }
  );
  return visitor;
};

export const applyAuthMiddlewares = (options: { app: Application }) => {
  options.app.get('/issue-visitor-token', async (req, res) => {
    const payload: JwtPayload = {
      subject: uuid.v4(),
      visitorType: VisitorType.Viewer,
    };
    const token = await new Promise<string>((resolve, reject) => {
      const opt = { expiresIn: '1 year' };
      jwt.sign(payload, process.env.JWT_SECRET, opt, (err, encoded) => {
        err ? reject(err) : resolve(encoded);
      });
    });
    res.json({ token });
  });
};
