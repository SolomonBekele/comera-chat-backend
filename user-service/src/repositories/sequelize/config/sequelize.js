import { Sequelize } from "sequelize";
import logger from "../../../utils/logger.js";
let sequelize = null;
// if(process.env.STORAGE_TYPE !=="sequelize"){
sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_ROOT_USER,
  process.env.MYSQL_ROOT_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: "mysql",
    logging: (msg) => logger.debug(msg), 
  }
);


(async () => {
  try {
    await sequelize.authenticate();
    logger.info(" Sequelize Database connection established successfully.");

    // Sync all models
    // await sequelize.sync(); 
    // logger.info("All tables synced successfully.");

  } catch (error) {
    logger.error("Database sync error", { stack: error.stack });
    process.exit(1); // optional: stop app if DB connection fails
  }
})();
// }
export default sequelize;