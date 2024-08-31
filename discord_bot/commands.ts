import { REST, Routes, SlashCommandBuilder } from "discord.js";
import Config from "../config/config";

export async function registerCommands(
  serverId: string,
  commands: {
    data: SlashCommandBuilder;
    execute: any;
  }[],
) {
  const rest = new REST({
    version: "9",
  }).setToken(Config.json.app.discordbot.token);

  const data = await rest.put(
    Routes.applicationGuildCommands(
      Config.json.app.discordbot.client_id,
      serverId,
    ),
    { body: commands.map((c) => c.data.toJSON()) },
  );
}
