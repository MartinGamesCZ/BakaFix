import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import Config from "../config/config";
import getTimetable from "../shared/baka/public/timetable";
import logger from "../shared/log/logger";
import {
  BakaTimetablePeriod,
  BakaTimetableType,
} from "../shared/types/baka/timetable";
import { LogLevel, LogSource } from "../shared/types/logger";
import { client } from "./client";
import { registerCommands } from "./commands";
import { readdirSync } from "fs";
import path from "path";

const commands: {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => void;
}[] = [];

export async function _start() {
  const log = logger(LogSource.DISCORDBOT);

  log(LogLevel.INFO, "Bot starting...");

  await client.login(Config.json.app.discordbot.token);
  log(LogLevel.INFO, "Bot started!");

  const servers = client.guilds.cache.map((guild) => guild.id);

  log(LogLevel.INFO, `Registering commands for ${servers.length} servers...`);

  for (const commandFile of readdirSync(path.join(__dirname, "commands"))) {
    const cmd = await import(path.join(__dirname, "commands", commandFile));

    commands.push({
      data: cmd.data,
      execute: cmd.execute,
    });
  }

  for (const server of servers) {
    log(LogLevel.INFO, `Registering commands for server ${server}`);
    await registerCommands(server, commands);
  }

  log(LogLevel.INFO, "Commands registered!");

  client.on("interactionCreate", (e) => {
    if (!e.isCommand()) return;

    const command = commands.find((cmd) => cmd.data.name === e.commandName);

    if (!command) return e.reply("Příkaz nenalezen");

    command.execute(e as ChatInputCommandInteraction);
  });
}
