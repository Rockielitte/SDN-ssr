import dotenv from "dotenv";

dotenv.config();

const AppConfig = {
  MONGO_DB_URI:
    process.env.MONGO_DB_URI || "mongodb://localhost:27017/LAST_ASM",
  PORT: parseInt(process.env.PORT) || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "!@#$",
  JWT_EXPIRE: parseInt(process.env.JWT_EXPIRE) || 1000 * 60 * 60 * 24,
  GG_CLIENT_ID:
    process.env.GG_CLIENT_ID ||
    "208765890667-4708b1s8v6q13sk3g2sjcpnvjcjf6cak.apps.googleusercontent.com",
};

export default AppConfig;
