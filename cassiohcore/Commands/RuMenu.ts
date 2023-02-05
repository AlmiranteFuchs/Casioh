//const puppeteer = require("puppeteer");
import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";
import { Alergeno, Alimento } from "./CommandsAssets/RuAPI/model/alimento";
import { Cardapio } from "./CommandsAssets/RuAPI/model/cardapio";
import { RestaurantLink, Scrapper } from "./CommandsAssets/RuAPI/scrapper/scrapper";

export class RuMenuCommand extends CommandModel {
  protected _active: boolean = true;
  protected _hidden: boolean = false;
  protected _name: string = "/ru";
  protected _description: string = "Mostra o cardápio do RU";
  protected _key: string = "ru";
  protected _options?: string[] | undefined = undefined;
  protected _alias: string | undefined = undefined;
  protected _access_level: number = 3;
  protected _limitedUse: boolean = false;
  protected _useLimit: number = 0;

  protected async execute_command(params?: IMessage_format): Promise<void> {
    console.log("Rodando Cardápio do RU!");

    try {

      const restaurat: RestaurantLink = params?.command_params![0] as RestaurantLink ?? RestaurantLink.Politecnico;
      const getMenu = async () => {

        const menu: Cardapio[] = await Scrapper.get(restaurat);

        function parseMenu(pratos: Alimento[]): string {
          let parsedMenu = "";

          pratos.forEach((prato) => {
            parsedMenu += ` - _${prato.nome}_ ${mapAlergenicsToEmote(prato)}\n`;
          });

          return parsedMenu.trim();
        }

        function mapAlergenicsToEmote(prato: Alimento): string {
          // Maps name to emote
          let alergenos_menu = "";

          prato.alergenos.forEach((alergenos: Alergeno) => {

            switch (alergenos) {
              case Alergeno.Amendoim:
                alergenos_menu += "🥜";
                break;
              case Alergeno.Crustáceos:
                alergenos_menu += "🦀";
                break;
              case Alergeno.Glúten:
                alergenos_menu += "🍞";
                break;
              case Alergeno.Lactose:
                alergenos_menu += "🐮";
                break;
              case Alergeno.Ovos:
                alergenos_menu += "🥚";
                break;
              case Alergeno["Origem animal"]:
                alergenos_menu += "🍖";
                break;
              case Alergeno.Peixe:
                alergenos_menu += "🐟";
                break;
              case Alergeno.Pimenta:
                alergenos_menu += "🌶️";
                break;
              case Alergeno.Soja:
                alergenos_menu += "🌾";
                break;
              case Alergeno.Outros:
                alergenos_menu += "⁉️";
                break;
            }
          });
          if (prato.vegano === true) alergenos_menu += "🌱";
          return alergenos_menu;
        }

        const menuMessage_today = {
          text: `*Cardápio do RU* _${restaurat}_ \nhoje\n`,
          attachments: [
            {
              title: "*Café da manhã*",
              text: parseMenu(menu[0].cafe.pratos),
            },
            {
              title: "*Almoço*",
              text: parseMenu(menu[0].almoco.pratos),
            },
            {
              title: "*Jantar*",
              text: parseMenu(menu[0].jantar.pratos),
            },
          ],
        };

        const menuMessage_tomorrow = {
          text: `*Cardápio do RU* _${restaurat}_ \namanhã\n `,
          attachments: [
            {
              title: "Café da manhã",
              text: parseMenu(menu[1].cafe.pratos),
            },
            {
              title: "*Almoço*",
              text: parseMenu(menu[1].almoco.pratos),
            },
            {
              title: "*Jantar*",
              text: parseMenu(menu[1].jantar.pratos),
            },
          ],
        }

        return [menuMessage_today, menuMessage_tomorrow];
      }

      const menu = await getMenu();

      for (let i = 0; i < menu.length; i++) {
        const cardapio = menu[i];

        let menu_message = "";
        menu_message += `${cardapio.text}\n`;
        cardapio.attachments.forEach(refeicao => {
          menu_message += `${refeicao.title}\n ${refeicao.text}\n\n`;
        });

        await new Promise<void>((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        }).then(() => {
          params?.client_name?.send_message(params?.id, menu_message, params);
        }).catch((error) => {
          console.log(error);
        });
      };

      return;

    } catch (error) {
      console.log(error);
      params?.client_name?.send_message(params?.id, "Brother, algo deu ruim lol, vê ai e avisa alguém: " + error, params);
    }
  }
}
