import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST) {
    throw new Error("❌ Missing required database environment variables");
}

const sequelize = new Sequelize(
    String(process.env.DB_NAME),
    String(process.env.DB_USER),
    String(process.env.DB_PASSWORD),
    {
        host: String(process.env.DB_HOST),
        dialect: "postgres",
        logging: false,
    }
);

export default sequelize;