export class UserModel {
    private _access_level: number;
    private _name: string;
    private _role: string;
    private _title: string;
    private _user_id: string

    constructor(access_level: number, name: string, role: string, title: string, user_id: string) {
        this._access_level = access_level == null ? UserAccessTypes.Plebe : access_level >= 0 && access_level <= 4 ? access_level : UserAccessTypes.Plebe;
        this._name = name ?? 'Desconhecido!';
        this._role = role ?? 'No roles? \u{1F440}\u{1F4A6}!';
        this._title = title ?? '';
        this._user_id = user_id;
    }

    //Getters and Setters
    public get access_level(): number {
        return this._access_level;
    }
    public get name(): string {
        return this._name;
    }
    public get role(): string {
        return this._role;
    }
    public get title(): string {
        return this._title;
    }
    public get user_id(): string {
        return this._user_id;
    }

}

export enum UserAccessTypes {
    Root = 0,
    Adm = 1,
    CAAD = 2,
    Trusted = 3,
    Plebe = 4,
}