import "dotenv/config";
import { startBot } from "./bot.js";

const token = process.env.DISCORD_TOKEN;
if (!token) throw new Error("DISCORD_TOKEN manquant dans .env");

startBot(token);
