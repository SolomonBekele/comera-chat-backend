import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    username: process.env.MYSQL_ROOT_USER ,
    password: process.env.MYSQL_ROOT_PASSWORD ,
    database: process.env.MYSQL_DB ,
    host: process.env.MYSQL_HOST ,
    port: process.env.MYSQL_PORT ,
    dialect: "mysql",
  },
 test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "user_db_test",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  },
  staging: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  },
}