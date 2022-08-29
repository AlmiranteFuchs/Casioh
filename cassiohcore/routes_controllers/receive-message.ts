import { Request, Response } from "express"

class receiverController {
    public receive(req: Request, res: Response) {
        console.log(req.body);
        
        res.sendStatus(501)
    }
}
export const receiver_controller = new receiverController();