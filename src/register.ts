import "dotenv/config";
import {
  REST,
  Routes,
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  InteractionContextType,
} from "discord.js";

const token = process.env.DISCORD_TOKEN;
const applicationId = process.env.APPLICATION_ID;

if (!token || !applicationId) {
  throw new Error("DISCORD_TOKEN et APPLICATION_ID requis dans .env");
}

const command = new ContextMenuCommandBuilder()
  .setName("Post LinkedIn")
  .setType(ApplicationCommandType.Message)
  .setContexts([
    InteractionContextType.Guild,
    InteractionContextType.BotDM,
    InteractionContextType.PrivateChannel,
  ]);

const rest = new REST().setToken(token);

rest
  .put(Routes.applicationCommands(applicationId), { body: [command.toJSON()] })
  .then(() => console.log('Commande "Post LinkedIn" enregistrée.'))
  .catch(console.error);
