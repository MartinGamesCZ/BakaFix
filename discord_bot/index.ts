import Config from "../config/config";
import logger from "../shared/log/logger";
import { LogLevel, LogSource } from "../shared/types/logger";
import { client } from "./client";
import { registerCommands } from "./commands";

export async function _start() {
  const log = logger(LogSource.DISCORDBOT);

  log(LogLevel.INFO, "Bot starting...");

  await client.login(Config.json.app.discordbot.token);
  log(LogLevel.INFO, "Bot started!");

  const servers = client.guilds.cache.map((guild) => guild.id);

  log(LogLevel.INFO, `Registering commands for ${servers.length} servers...`);
  for (const server of servers) {
    log(LogLevel.INFO, `Registering commands for server ${server}`);
    await registerCommands(server);
  }

  log(LogLevel.INFO, "Commands registered!");

  //getTimetable(BakaTimetablePeriod.Permanent, BakaTimetableType.Class, "66");
}
