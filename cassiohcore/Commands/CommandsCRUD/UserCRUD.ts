import { User } from "../../Modal/ModelsBD/User.model";
import { IMessage_format } from "../../Modal/MessageModel";
import "../../db.config";
import { Sequelize } from "sequelize";

export class UserCRUD {
	private userCRUD: any;

	constructor() {}

	/* Insert a user in database */
	static async createUser(user_id: string, username: string, phone: string, access_level: number) {
		try {
			User.create({ user_id: user_id, username: username, phone: phone, access_level: access_level });
			//console.log("numero=> ", await phone);
		} catch (err) {
			console.error("Error::" + err);
		}
		return;
	}

	static async getUsers() {
		try {
			const user = await User.findAll();
			return user;
		} catch (err) {
			console.log(err);
			return [];
		}
	}

	/* return a single user */
	static async getUser(target: String) {
		const user = await User.findOne({
			where: {
				user_id: target
			}
		});
		if (user === null) {
			console.log("Not found!");
            return user;
		}
        return user;
		
	}

	/* Remove a single user */
	static async deleteUser(target: String) {
		try {
			const user = User.destroy({
				where: {
					name: target
				}
			});
			return "item deletado com sucesso!!!!!!!!";
		} catch (err) {
			console.log(err);
			return [];
		}
	}
}
