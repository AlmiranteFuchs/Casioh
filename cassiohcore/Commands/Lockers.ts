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
    private _csv_headers = ["locker", "active", "status", "owner", "owner_phone", "owner_email", "last_payment", "due_date", "is_overdue", "notified", "responsible", "responsible_phone", "responsible_email"];

    protected execute_command(params?: IMessage_format | undefined): void {
        // Check if CSV already exists
        if (this._fileExists("lockers.csv")) {

            // Check if its internal run 
            if (params?.command_options?.includes("-internal")) {
                this.checkOverdueLockers(params);
                return;
            }

            // Check if its the pay option
            if (params?.command_options?.includes("-pay")) {
                if(params.command_params?.length == 0){
                    params?.client_name.send_message(params.chat_id, "Você precisa especificar o armário que deseja registrar como pago");
                    return;
                }
                this._payLocker(params);
                return;
            }

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
    private _createLockerObject(locker: number, status: string): any {
        return {
            locker: locker,
            active: "false",
            status: status,
            owner: "",
            owner_phone: "",
            owner_email: "",
            last_payment: "",
            due_date: "",
            is_overdue: "false",
            notified: "false",
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
            notified: csv_array[9] == "true" ? true : false,
            responsible: csv_array[10],
            responsible_phone: csv_array[11],
            responsible_email: csv_array[12]
        }

        return csv_object;
    }

    // Check for overdue lockers
    private _checkOverdueLockers(lockers: csv_object[]): csv_object[] {
        let overdue_lockers: csv_object[] = [];

        lockers.forEach((element) => {
            // TODO: Determine overdue by date, make possible to confirm payment for x days
            if (!element.active) { return; }

            if ((new Date().toISOString() >= element.due_date) && element.due_date != "") {
                // Redundant, but just to be sure
                element.is_overdue = true;
            }

            // Check if locker is overdue and if it was notified
            if (element.is_overdue && element.notified == false) {
                overdue_lockers.push(element);
            }
        });

        return overdue_lockers;
    }

    // Checking overdue lockers and sending messages to responsible and owner
    private checkOverdueLockers(params: IMessage_format): void {
        // Read CSV file
        const data = fs.readFileSync(this._csv_path);

        // Convert CSV to string
        const csv_string: string = data.toString();

        // Convert CSV string to array
        const csv_array: string[] = csv_string.split("\n");

        // Remove headers
        csv_array.shift();

        // Cast the array to csv_object
        const csv_object_array: csv_object[] = this._castArrayToCSVObject(csv_array);

        // Check for overdue lockers
        const overdue_lockers: csv_object[] = this._checkOverdueLockers(csv_object_array);

        // Check if there are overdue lockers
        if (overdue_lockers.length > 0) {
            console.log("[Caadsioh]: Armários atrasados encontrados!");
            // Send messages to responsible and owner

            // Responsible 
            for (let i = 0; i < overdue_lockers.length; i++) {
                const element = overdue_lockers[i];

                // Message to responsible
                const message: string = `Olá, ${element.responsible}! O armário ${element.locker} está atrasado. Por favor, entre em contato com ${element.owner} para regularizar a situação,
                telefone: ${element.owner_phone}, email: ${element.owner_email}, após confirme o pagamento com o comando !lockers -p ${element.locker}`;

                params?.client_name.send_message(element.responsible_phone + "@s.whatsapp.net", message);

                // Message to owner
                const message_owner: string = `Olá, ${element.owner}! O armário ${element.locker} está atrasado. Por favor, entre em contato com o responsável pelo armário para regularizar a situação,
                telefone: ${element.responsible_phone}, email: ${element.responsible_email}`;

                // We need to wait a little bit to send the message, otherwise it will not be sent bc the other one
                setTimeout(() => {
                    params?.client_name.send_message(element.owner_phone + ">@s.whatsapp.net", message_owner);
                }, 1000);

                // Update CSV file
                overdue_lockers[i].notified = true;
            }

            // Switch all the filtered lockers on the original array
            csv_object_array.forEach((element) => {
                overdue_lockers.forEach((overdue_element) => {
                    if (element.locker == overdue_element.locker) {
                        element = overdue_element;
                    }
                });
            });

            let copy: csv_object[] = csv_object_array;  // Remove last element, bc ????
            copy.pop();

            // Update CSV file
            this._updateCSVFile(copy);

        } else {
            console.log("[Caadsioh]: Nenhum armário atrasado encontrado!");
        }
        return;

    }

    private _updateCSVFile(csv_object_array: csv_object[]): void {
        let csv_string: string = this._csv_headers.join(",") + "\n";

        csv_object_array.forEach((element) => {
            csv_string += element.locker + "," +
                element.active + "," +
                element.status + "," +
                element.owner + "," +
                element.owner_phone + "," +
                element.owner_email + "," +
                element.last_payment + "," +
                element.due_date + "," +
                element.is_overdue + "," +
                element.notified + "," +
                element.responsible + "," +
                element.responsible_phone + "," +
                element.responsible_email + "\n";
        });

        fs.writeFileSync(this._csv_path, csv_string);
    }

    private _payLocker(params: IMessage_format): void {
        // Get all the lockers
        const data = fs.readFileSync(this._csv_path);

        // Convert CSV to string
        const csv_string: string = data.toString();

        // Convert CSV string to array
        const csv_array: string[] = csv_string.split("\n");

        // Remove headers
        csv_array.shift();

        // Cast the array to csv_object
        const csv_object_array: csv_object[] = this._castArrayToCSVObject(csv_array);

        // Search for the locker
        let locker: csv_object | undefined = csv_object_array.find((element) => {
            return element.locker == parseInt(params.command_params![0]);
        });

        if (locker == undefined) {
            params.client_name.send_message(params.chat_id, "Armário não encontrado!");
            return;
        }
        
        // Check if the responsible for the locker is the one who is paying
        if (locker.responsible_phone != params.chat_id?.split("@")[0]) {
            params.client_name.send_message(params.chat_id, "Você não é o responsável pelo armário!");
            return;
        }

        // Add 30 days to the due date
        let due_date: Date = new Date(locker.due_date);
        due_date.setDate(due_date.getDate() + 30);

        // Update locker
        locker.due_date = due_date.toISOString();
        locker.is_overdue = false;
        locker.notified = false;

        // Alter the locker on the array
        csv_object_array.forEach((element) => {
            if (element.locker == locker!.locker) {
                element = locker as csv_object;
            }
        });

        csv_object_array.pop();

        // Update CSV file
        this._updateCSVFile(csv_object_array);
        
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
    notified: boolean;

    responsible: string;
    responsible_phone: string;
    responsible_email: string;
}
