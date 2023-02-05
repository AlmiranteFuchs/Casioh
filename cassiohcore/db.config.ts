import { Sequelize }  from 'sequelize';

import * as dotenv from 'dotenv';
import { Connection } from 'puppeteer';

export class Db {

  public connection : Sequelize;
  
  constructor() {
    this.connection = new Sequelize('cassioh', 'postgres', 'UCoY8*', {
      host: 'localhost',
      dialect: 'postgres',
      pool: {
          max: 10,
          min: 0,
          acquire: 20000,
          idle: 5000
      }
    });
    this.connection.authenticate().then(() => {
      console.log('Connection has been established successfully.');
     
   }).catch((error) => {
      console.error('Unable to connect to the database: ', error);
   });
  }


}

