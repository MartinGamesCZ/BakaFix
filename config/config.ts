import config from "./config.json";

export const APP_ENABLED_DISCORDBOT = config.app.discordbot.enabled; // Zda je povolen discord bot
export const APP_ENABLED_TIMETABLEWATCHER =
  config.app.timetable_watcher.enabled; // Zda je povolen timetable watcher

const Config = {
  APP_ENABLED_DISCORDBOT,
  APP_ENABLED_TIMETABLEWATCHER,

  app: {
    enabled: {
      discordbot: APP_ENABLED_DISCORDBOT,
      timetable_watcher: APP_ENABLED_TIMETABLEWATCHER,
    },
  },

  json: config,
};

export default Config;
