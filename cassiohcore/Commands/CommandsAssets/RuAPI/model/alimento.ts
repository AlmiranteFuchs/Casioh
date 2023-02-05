// Representa um alimento
export class Alimento {
    // Nome do alimento
    public nome: string;
    // Lista de alergenos
    public alergenos: Alergeno[];

    public vegano: boolean;

    public constructor(nome: string, alergenos: Alergeno[], vegano: boolean) {
        this.nome = nome;
        this.alergenos = alergenos;
        this.vegano = vegano;
    }
}

// Enum para os alergenos
export enum Alergeno {
    "Glúten" = "gluten",
    "Crustáceos" = "crustaceos",
    "Ovos" = "ovos",
    "Peixe" = "peixe",
    "Amendoim" = "amendoim",
    "Soja" = "soja",
    "Lactose" = "lactose",
    "Pimenta" = "pimenta",
    "Origem animal" = "origem_animal",
    "Outros" = "outros"
}