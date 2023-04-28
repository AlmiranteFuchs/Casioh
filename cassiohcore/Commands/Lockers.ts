import path from "path";
import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";
import { stringify } from 'csv-stringify/sync';
import assert from 'assert';
import fs from "fs";

export class LockersCommand extends CommandModel {
    protected _key: string = "lockers";
    protected _name: string = "!lockers";
    protected _alias?: string | undefined = undefined;
    protected _options?: string[] | undefined = ["-a"];
    protected _description: string = "Consulta os armários disponíveis";
    protected _access_level: number = 0; // Not used
    protected _active: boolean = true;
    protected _hidden: boolean = false;
    protected _limitedUse?: boolean | undefined = false;
    protected _useLimit?: number | undefined = undefined;

    // Private variablesactive
    private _csv_path: string = path.resolve(__dirname, "./CommandsAssets/lockers.csv");
    private _csv_headers = ["locker", "active", "status", "owner", "owner_phone", "owner_email", "last_payment", "due_date", "is_overdue", "responsible", "responsible_phone", "responsible_email"];

    protected execute_command(params?: IMessage_format | undefined): void {
        // Check if CSV already exists
        if (this._fileExists("lockers.csv")) {

            // Get phone number of the user
            const phone_number = params?.chat_id?.split("@")[0]! ?? 999999999999;

            // Check if the user wants to see all lockers
            const found_locker = this._readCSVByPhone(phone_number, params?.command_options?.includes("-a") ? false : true);

            if (found_locker == undefined) return params?.client_name.send_message(params.chat_id, "Armário não encontrado, sinto muito");

            const message: string = this._arrayToString(found_locker);

            params?.client_name.send_message(params.chat_id, message);
            return;

        } else {
            this._createCSV(this._csv_headers);
        }
    }

    // Create CSV file
    private _createCSV(headers: string[]): void {
        // Generate a csv object with the interface

        const max_lockers: number = 45;
        let csv_object_array: csv_object[] = [];

        // Generate locker objects
        for (let i = 1; i <= max_lockers; i++) {
            csv_object_array.push(this._createLockerObject(i, "Não alugado"));
        }

        // Generate CSV string
        const csv_string: string = stringify(csv_object_array, { header: true, columns: headers });

        // Write CSV file
        fs.writeFile(this._csv_path, csv_string, (err) => {
            console.error("[Caadsioh]: Não foi possível criar CSV");
            // Ai tu faz o L
            return;
        });

        // Check if CSV was created
        if (this._fileExists("lockers.csv")) {
            console.log("[Caadsioh]: CSV criado com sucesso!");
        }
        return;
    }

    // Check if file exists
    private _fileExists(filename: string): boolean {
        return fs.existsSync(this._csv_path) ? true : false;
    }

    // Generates locker object
    private _createLockerObject(locker: number, status: string): csv_object {
        return {
            locker: locker,
            active: false,
            status: status,
            owner: "",
            owner_phone: "",
            owner_email: "",
            last_payment: "",
            due_date: "",
            is_overdue: false,
            responsible: "",
            responsible_phone: "",
            responsible_email: ""
        }
    }

    // Reads CSV file by phone number
    private _readCSVByPhone(phone: string, filter: boolean): csv_object[] | undefined {
        const data = fs.readFileSync(this._csv_path);

        // Convert CSV to string
        const csv_string: string = data.toString();

        // Convert CSV string to array
        const csv_array: string[] = csv_string.split("\n");

        // Remove headers
        csv_array.shift();

        // Cast the array to csv_object
        const csv_object_array: csv_object[] = this._castArrayToCSVObject(csv_array);

        // Object 
        let locker: csv_object[] | undefined;

        // Filter the array
        if (filter) {
            // Find the locker by phone number
            locker = csv_object_array.filter((element) => {
                return element.owner_phone == phone;
            });
        } else {
            // If the user wants to see all lockers
            // Get all lockers with his number as responsible
            locker = csv_object_array.filter((element) => {
                return element.responsible_phone == phone;
            });
        }

        // Check if locker was found
        if (locker) {
            console.log("[Caadsioh]: Armário encontrado!");
            return locker;
        }
        return;
    }

    private _arrayToString(found_locker: csv_object[]): string {
        let message: string = "";
        found_locker.forEach(element => {
            message +=
                "Armário: _*" + element?.locker + "*_\n" +
                "Ativo: _*" + (element?.active ? "Ativo" : "Inativo") + "*_\n" +
                "Status: _*" + element?.status + "*_\n" +
                "Dono: _*" + element?.owner + "*_\n" +
                "Telefone: _*" + element?.owner_phone + "*_\n" +
                "Email: _*" + element?.owner_email + "*_\n" +
                "Último pagamento: _*" + element?.last_payment + "*_\n" +
                "Vencimento: _*" + element?.due_date + "*_\n" +
                "Atrasado: _*" + (element?.is_overdue ? "Sim!" : "Não") + "*_\n" +
                "Responsável: _*" + element?.responsible + "*_\n" +
                "Telefone do Responsável: _*" + element?.responsible_phone + "*_\n" +
                "Email do Responsável: _*" + element?.responsible_email + "*_\n\n\n";
        });

        return message;
    }

    private _castArrayToCSVObject(csv_array: string[]): csv_object[] {
        let csv_object_array: csv_object[] = [];

        csv_array.forEach((element) => {
            const csv_object: csv_object = this._castStringToCSVObject(element);
            csv_object_array.push(csv_object);
        });

        return csv_object_array;
    }

    private _castStringToCSVObject(csv_string: string): csv_object {
        const csv_array: string[] = csv_string.split(",");
        const csv_object: csv_object = {
            locker: parseInt(csv_array[0]),
            active: csv_array[1] == "true" ? true : false,
            status: csv_array[2],
            owner: csv_array[3],
            owner_phone: csv_array[4],
            owner_email: csv_array[5],
            last_payment: csv_array[6],
            due_date: csv_array[7],
            is_overdue: csv_array[8] == "true" ? true : false,
            responsible: csv_array[9],
            responsible_phone: csv_array[10],
            responsible_email: csv_array[11]
        }

        return csv_object;
    }
}

// Interface object for csv file
interface csv_object {
    locker: number;
    active: boolean;
    status: string;

    owner: string;
    owner_phone: string;
    owner_email: string;

    last_payment: string;
    due_date: string;
    is_overdue: boolean;

    responsible: string;
    responsible_phone: string;
    responsible_email: string;
}
