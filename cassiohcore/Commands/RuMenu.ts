const puppeteer = require("puppeteer");
import { CommandModel } from "../Modal/CommandModel";
import { IMessage_format } from "../Modal/MessageModel";

export class RuMenuCommand extends CommandModel {
  protected _active: boolean = true;
  protected _hidden: boolean = false;
  protected _name: string = "/ru";
  protected _description: string = "Mostra o cardápio do RU";
  protected _key: string = "ru";
  protected _access_level: number = 3;

  protected async execute_command(params?: IMessage_format): Promise<void> {
    console.log("Rodando Cardápio do RU!");
    try {
      const getMenu = async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto("https://pra.ufpr.br/ru/ru-centro-politecnico/", {
          waitUntil: "networkidle2",
        });

        await page.waitForSelector("tbody");
        await page.waitForSelector("p > strong");

        const response = await page.evaluate(() => {
          //@ts-ignore
          const breakfastTitle: any = document.querySelectorAll(
            "tbody > tr:nth-child(1)"
          );
          //@ts-ignore
          const lunchTitle: any = document.querySelectorAll(
            "tbody > tr:nth-child(3)"
          );
          //@ts-ignore
          const dinnerTitle: any = document.querySelectorAll(
            "tbody > tr:nth-child(5)"
          );

          //@ts-ignore
          const breakfastHTML: any = document.querySelectorAll(
            "tbody > tr:nth-child(2)"
          );
          //@ts-ignore
          const lunchHTML: any = document.querySelectorAll(
            "tbody > tr:nth-child(4)"
          );
          //@ts-ignore
          const dinnerHTML: any = document.querySelectorAll(
            "tbody > tr:nth-child(6)"
          );
          //@ts-ignore
          let daysHTML: any = document.querySelectorAll("p > strong");

          //@ts-ignore
          const numberOfTables: any = document.querySelectorAll("table").length;

          let days = [""];

          if (numberOfTables === 1) {
            // Checks if the first day has a table
            if (
              //@ts-ignore
              document.querySelector("p + figure")?.children.toString() ===
              "[object HTMLTableElement]"
            ) {
              days = [daysHTML[0].innerText.toString()];
            } else {
              days = [daysHTML[1].innerText.toString()];
            }
          } else {
            days = [
              daysHTML[0].innerText.toString(),
              daysHTML[1].innerText.toString(),
            ];
          }

          const titles = days.map((day: string, index: number) => {
            return {
              breakfast: breakfastTitle[index].innerText.toString(),
              lunch: lunchTitle[index].innerText.toString(),
              dinner: dinnerTitle[index].innerText.toString(),
            };
          });

          const menus = days.map((day: string, index: number) => {
            return {
              breakfast: breakfastHTML[index].innerText.toString(),
              lunch: lunchHTML[index].innerText.toString(),
              dinner: dinnerHTML[index].innerText.toString(),
            };
          });

          let menuResponse = [];

          menuResponse = days.map((day: string, index: number) => {
            return {
              weekDay: days[index].toString(),
              breakfast: {
                title: titles[index].breakfast.toString(),
                menu: menus[index].breakfast.toString(),
              },
              lunch: {
                title: titles[index].lunch.toString(),
                menu: menus[index].lunch.toString(),
              },
              dinner: {
                title: titles[index].dinner.toString(),
                menu: menus[index].dinner.toString(),
              },
            };
          });

          return menuResponse;
        });

        await browser.close();

        return response;
      };

      const ruMenu = await getMenu();

      const parseMenu = (menu: string): string => {
        return menu
          .split("\n")
          .map((meal: string, index: number) => {
            if (index === 0) {
              return `\n*-* ${meal.trim()}`;
            }
            return `*-* ${meal.trim()}`;
          })
          .join("\n");
      };

      const messageParsed = ruMenu
        .map((day: any) => {
          return `\n*${day.weekDay}* \n
      *_${day.breakfast.title}_*
      ${parseMenu(day.breakfast.menu)} \n
      *_${day.lunch.title}_*
      ${parseMenu(day.lunch.menu)} \n
      *_${day.dinner.title}_*
      ${parseMenu(day.dinner.menu)}\n`;
        })
        .join("\n");

      const message = `
        Cardápio RU Centro Politécnico \n 
        ${messageParsed}`;

      /*   let payload: object = { text_reply: message };
  
        params!.specific = payload; */

      /* let command_result: any = new SendReplyCommand().Exec_command(0, params); */
      params!.specific.reply = true;
      params?.client_name.send_message(params?.id, message, params);

    } catch (error) {
      console.log("Erro em Ru: ", error);
    }
  }
}
