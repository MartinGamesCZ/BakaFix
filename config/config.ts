import config from "./config.json";

export const APP_ENABLED_DISCORDBOT = true; // Zda je povolen discord bot

const Config = {
  APP_ENABLED_DISCORDBOT,

  app: {
    enabled: {
      discordbot: APP_ENABLED_DISCORDBOT,
    },
  },

  json: config,
};

export default Config;
