import { NextFunction, Request, Response } from "express";

export const createAuthorizationMiddleware = (secret: string) => (req: Request, res: Response, next: NextFunction) => {
    const auth_header = req.get('Authorization')

    if (auth_header === secret) {
        next();
    } else {
        res.status(401).send("Hum... não sei não meu bom, acho que vou ter que estar negando esse request ai");
    }
}