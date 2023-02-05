import { Alimento } from "./alimento";

// Representa uma refeição de um cardápio
export class Refeicao {
    // Tipo de refeição
    public tipo: TipoRefeicao;

    // Lista de pratos
    public pratos: Alimento[];

    public constructor(tipo: TipoRefeicao, pratos: Alimento[]) {
        this.tipo = tipo;
        this.pratos = pratos;
    }
}

// Enum para tipo de refeição
export enum TipoRefeicao {
    "Almoço" = "almoco",
    "Jantar" = "jantar",
    "Cafe da manhã" = "cafe",
}