import Config from "../config/config";

if (Config.app.enabled.discordbot) {
  const bot = await import("../discord_bot/index");

  bot._start();
}
