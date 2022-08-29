import { Request, Response } from "express"

class HomeConteroller {
    public Home(req: Request, res: Response) {
        res.render("index");
    }
}
export const home_controller = new HomeConteroller();