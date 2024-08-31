import { REST, Routes, SlashCommandBuilder } from "discord.js";
import Config from "../config/config";

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!")
    .toJSON(),
];

export async function registerCommands(serverId: string) {
  const rest = new REST({
    version: "9",
  }).setToken(Config.json.app.discordbot.token);

  const data = await rest.put(
    Routes.applicationGuildCommands(
      Config.json.app.discordbot.client_id,
      serverId,
    ),
    { body: commands },
  );
}
