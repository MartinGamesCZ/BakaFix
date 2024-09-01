import chalk from "chalk";
import { LogLevel, LogSource } from "../types/logger";
import { DateTime } from "luxon";

const levels = {
  [LogLevel.INFO]: chalk.blue,
  [LogLevel.WARN]: chalk.yellow,
  [LogLevel.ERROR]: chalk.red,
  [LogLevel.DEBUG]: chalk.green,
};

const sources = {
  [LogSource.LAUNCHER]: chalk.magenta,
  [LogSource.DISCORDBOT]: chalk.cyan,
  [LogSource.TIMETABLEWATCHER]: chalk.green,
};

export default function logger(source: LogSource) {
  return (level: LogLevel, message: string) => {
    const datetime = DateTime.now().toFormat("dd. MM. yyyy HH:mm:ss");

    console.log(
      `${chalk.gray(datetime.padEnd(22, " "))} ${sources[source](source.padEnd(18, " "))} ${levels[level](level.padEnd(6, " "))} ${message}`,
    );
  };
}
