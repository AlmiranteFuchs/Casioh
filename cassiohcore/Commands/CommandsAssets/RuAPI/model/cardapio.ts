import { Refeicao } from "./refeicao";

// Representa um cardápio de um restaurante
export class Cardapio {
    // Nome do restaurante 
    public ru_nome: string;
    // Data do cardápio
    public data: Date;
    
    // Lista de refeições
    public cafe: Refeicao;
    public almoco: Refeicao;
    public jantar: Refeicao;

    public constructor(ru_nome: string, data: Date, cafe: Refeicao, almoco: Refeicao, jantar: Refeicao) {
        this.ru_nome = ru_nome;
        this.data = data;
        this.cafe = cafe;
        this.almoco = almoco;
        this.jantar = jantar;
    }
}