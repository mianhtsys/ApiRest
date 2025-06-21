import {Sequelize} from 'sequelize'
import config from '../config/env.js';

export const sequelize = new Sequelize(

  config.DB_DATABASE,
  config.DB_USER,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    dialect: config.DB_DIALECT, // 'mysql', 'postgres', 'sqlite', 'mariadb', 'mssql'
    logging: console.log(), // Disable logging for cleaner output
  }
);


  // diplomado_db, //db name
  // postgres,   //db username
  // postgres,   //db passwordç