import { Request, Response } from "express"

class PrivateController {
    public Private(req: Request, res: Response) {
        res.sendStatus(501)
    }
}
export const private_controller = new PrivateController();