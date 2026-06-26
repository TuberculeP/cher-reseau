import {
  Client,
  GatewayIntentBits,
  Events,
  Message,
} from "discord.js";
import { renderLinkedInPost } from "./linkedin.js";

async function buildPostImage(message: Message): Promise<Buffer> {
  const author = message.author;
  const displayName =
    (message.member?.displayName) ??
    author.displayName ??
    author.username;

  const avatarBase64 = await fetch(
    author.displayAvatarURL({ extension: "png", size: 256 })
  )
    .then((r) => r.arrayBuffer())
    .then((buf) => Buffer.from(buf).toString("base64"));

  return renderLinkedInPost({ displayName, avatarBase64, content: message.content });
}

export function startBot(token: string) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  client.once(Events.ClientReady, (c) => {
    console.log(`Bot connecté : ${c.user.tag}`);
  });

  // Mention en réponse à un message
  client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    if (!message.mentions.users.has(client.user!.id)) return;
    if (!message.reference?.messageId) return;

    try {
      const referenced = await message.fetchReference();
      const imageBuffer = await buildPostImage(referenced);
      await message.reply({
        files: [{ attachment: imageBuffer, name: "post.png" }],
      });
    } catch (err) {
      console.error("Erreur génération post :", err);
      await message.reply("Impossible de générer le post LinkedIn.");
    }
  });

  // Context menu : clic droit → Apps → "Post LinkedIn"
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isMessageContextMenuCommand()) return;
    if (interaction.commandName !== "Post LinkedIn") return;

    await interaction.deferReply();

    try {
      const imageBuffer = await buildPostImage(interaction.targetMessage);
      await interaction.editReply({
        files: [{ attachment: imageBuffer, name: "post.png" }],
      });
    } catch (err) {
      console.error("Erreur génération post :", err);
      await interaction.editReply("Impossible de générer le post LinkedIn.");
    }
  });

  client.login(token);
}
