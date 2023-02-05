import { Copypasta } from "../../Modal/ModelsBD/Copypasta.model";
import "dotenv/config";
import { IMessage_format } from "../../Modal/MessageModel";
import "../../db.config";

export class CopypastaCRUD {
	private copypastaCRUD: any;

	constructor() {}

	/* Insert a copypasta in database */
	static async createCopypasta(copypasta_name: string, copypasta_content: string, user_id: string) {
		try {
			Copypasta.create({ name: copypasta_name, text: copypasta_content, user_id: user_id });
		} catch (err) {
			console.error("Error::" + err);
		}
		return;
	}

	static async getCopypastas() {
		try {
			const copypasta = await Copypasta.findAll();
			return copypasta;
		} catch (err) {
			console.log(err);
			return [];
		}
	}

	static async getCopypastaByUser(user: string, name: string) {
		try {
			const copypasta = await Copypasta.findOne({
				where: {
					name: name,
					user_id: user
				}
			});
			return copypasta;
		} catch (err) {
			console.log(err);
			return [];
		}
	}

	/* return a single copypasta */
	static async getCopypasta(target: String) {
		const copypasta = await Copypasta.findOne({
			where: {
				name: target
			}
		});

		return copypasta;
	}

	/* Remove a single copypasta by 
        name and user, return 1 if
        success, 0 if not 
    */
	static async deleteCopypasta(target: string, user: string) {
		try {
			const copypasta = Copypasta.destroy({
				where: {
					name: target,
                    user_id: user
				}
			});
			return copypasta;
		} catch (err) {
			console.log(err);
			return "[]";
		}
	}

	static async updateCopypasta(name: string, content: string, user: string) {
		try {
			const copypasta = Copypasta.upsert({
				where: {
					name: name,
					user_id: user
				}
			});
		} catch (err) {
			console.log(err);
			return [];
		}
	}
}
