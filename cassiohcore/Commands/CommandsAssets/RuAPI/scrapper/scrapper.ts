import { Refeicao, TipoRefeicao } from "../model/refeicao";
import axios from "axios";
import cherio from "cheerio";
import { Alergeno, Alimento } from "../model/alimento";
import { Cardapio } from "../model/cardapio";

// I suck balls at scraping. if you see this, implement interfaces for object building and work on this scraping.
export class Scrapper {
    public static async get(restaurant: RestaurantLink): Promise<Cardapio[]> {
        let cardapios: Cardapio[] = [];


        const url = restaurant;
        const axiosInstance = axios.create();

        await axiosInstance.get(url).then((response: any) => {
            const html = response.data;
            const $ = cherio.load(html);

            // Get the first table of the content
            const today_table = $("table").first();
            // Get the second table of the content
            const tomorrow_table = $("table").eq(1);

            let today_menu = this._parseTable(today_table, $);
            let tomorrow_menu = this._parseTable(tomorrow_table, $);


            if (today_menu.length > 0) {
                const cardapio_hoje = new Cardapio("", new Date(), today_menu[0], today_menu[1], today_menu[2]);
                cardapios.push(cardapio_hoje);
            }

            if (tomorrow_menu.length > 0) {
                const cardapio_amanha = new Cardapio("", new Date(), tomorrow_menu[0], tomorrow_menu[1], tomorrow_menu[2]);
                cardapios.push(cardapio_amanha);
            }

        });

        return cardapios;
    }

    private static _parseTable(table: cheerio.Cheerio, $: cheerio.Root): Refeicao[] {
        let refeicoes: Refeicao[] = [];

        // Get the second tr of the table, it's the coffe one
        const tr = table.find("tr").eq(1);
        let coffe = this._parseElement(tr, $);

        if (coffe.length > 0) {
            const refeicao_cafe = new Refeicao(TipoRefeicao["Cafe da manhã"], coffe);
            refeicoes.push(refeicao_cafe);
        }

        // Get the fourth tr of the table, it's the lunch one
        const tr2 = table.find("tr").eq(3);
        let almoco = this._parseElement(tr2, $);

        if (almoco.length > 0) {
            const refeicao_almoco = new Refeicao(TipoRefeicao.Almoço, almoco);
            refeicoes.push(refeicao_almoco);
        }

        // Get the sixth tr of the table, it's the dinner one
        const tr3 = table.find("tr").eq(5);
        let jantar = this._parseElement(tr3, $);

        if (jantar.length > 0) {
            const refeicao_jantar = new Refeicao(TipoRefeicao.Jantar, jantar);
            refeicoes.push(refeicao_jantar);
        }

        return refeicoes;
    }

    // Specific reusable, receives "cafe tr" or "almoco tr etc"
    private static _parseElement(element: cheerio.Cheerio, $: cheerio.Root): Alimento[] {
        let alimentos: Alimento[] = [];

        // foreach element on the td
        element.each((index: any, elements: any) => {

            // get the text of the element
            //const text = $(elements).text();

            // Split tag in br
            const text = $(elements).html();
            const text_array = text?.split("<br>");

            text_array?.forEach((el: any) => {
                // if the text is not empty

                if (text != "") {
                    const a = $(el).find("a");      // get the a tag of the element
                    let name = $(el).text().trim(); // get the text of the element


                    // Get all images on the element
                    const images = $(el).find("img").map((i, el) => {
                        return $(el).attr("src");
                    }).get();

                    //console.table(images);
                    

                    let alergicos: Alergeno[] = [];
                    let vegano = true;

                    images.forEach(href => {

                        if (href != undefined) {

                            href = href.toString().toLowerCase().trim();

                            // compare the href with the allergens
                            if (href.includes("gluten")) {
                                alergicos.push(Alergeno.Glúten);
                            }
                            if (href.includes("simbolo-vegano")) {
                                vegano = true;
                            }
                            if (href.includes("origem-animal")) {
                                alergicos.push(Alergeno["Origem animal"]);
                                vegano = false;
                            }
                            if (href.includes("alergenicos")) {
                                alergicos.push(Alergeno.Outros);
                            }
                            if (href.includes("leite")) {
                                vegano = false;
                                alergicos.push(Alergeno.Lactose);
                            }
                            if (href.includes("pimenta")) {
                                alergicos.push(Alergeno.Pimenta);
                            }
                            if (href.includes("ovo")) {
                                vegano = false;
                                alergicos.push(Alergeno.Ovos);
                            }
                        }
                    });

                    // Create a new Alimento
                    const alimento = new Alimento(name, alergicos, vegano);     // TODO: Add the allergens and if it is vegetarian
                    alimentos.push(alimento);

                }
            });
        });

        return alimentos;
    }

}


// Enum for the links of the restaurants
export enum RestaurantLink {
    "politécnico" = "https://pra.ufpr.br/ru/ru-centro-politecnico/",
    "reitoria" = "https://pra.ufpr.br/ru/ru-central/",
    "agrárias" = "https://pra.ufpr.br/ru/cardapio-ru-agrarias/",
    "botânico" = "https://pra.ufpr.br/ru/cardapio-ru-jardim-botanico/",
}