import axios from "axios";
import getTimetable from "../shared/baka/public/timetable";
import {
  BakaTimetablePeriod,
  BakaTimetableType,
} from "../shared/types/baka/timetable";
import Config from "../config/config";
import { readFileSync, writeFileSync, createReadStream } from "fs";
import path from "path";
import Handlebars from "handlebars";
import { BakaPublic } from "../shared/baka/public/request";
import nodeHtmlToImage from "node-html-to-image";
import FormData from "form-data";
import { Webhook } from "discord-webhook-node";
import generateTimatable from "../shared/image_gen/timetable";
import getClassList from "../shared/baka/public/classlist";
import logger from "../shared/log/logger";
import { LogLevel, LogSource } from "../shared/types/logger";

const updateInterval = 5 * 60 * 1000; // 5 minutes

let announcedChanges: any[] = [];

const log = logger(LogSource.TIMETABLEWATCHER);

export async function _start() {
  log(LogLevel.INFO, "Starting timetable watcher...");

  check();

  setInterval(check, updateInterval);
}

async function check() {
  log(LogLevel.INFO, "Checking for changes...");

  const timetable = await getTimetable(
    (Config.json.app.timetable_watcher.timeframe as BakaTimetablePeriod) ??
      BakaTimetablePeriod.Actual,
    BakaTimetableType.Class,
    Config.json.app.timetable_watcher.class,
  );

  const changes = timetable.map((d) =>
    d
      .filter((l) => {
        return l.details.type && l.details.type != "atom";
      })
      .map((l) => l.details)
      .filter((a) => !announcedChanges.includes(JSON.stringify(a))),
  );

  const lines: string[] = [];

  log(
    LogLevel.INFO,
    `Found ${changes.map((a) => a.length).reduce((total, v) => total + v)} changes.`,
  );

  for (const day of changes) {
    if (day.length < 1) continue;

    day
      .map(
        (l) =>
          (l.type == "absent" ? "🟢 " : "🔴 ") +
          (l.subjecttext.split("|")[0] +
            l.subjecttext.split("|")[1].split(" ")[1] +
            ". hodina --> ") +
          (l.InfoAbsentName ?? l.removedinfo),
      )
      .forEach((l) => lines.push(l));
  }

  if (lines.length < 1) return;

  log(LogLevel.INFO, "Sending changes...");

  await axios
    .post(Config.json.app.timetable_watcher.webhook, {
      content: `# Změna v rozvrhu\nTřída: ${Config.json.app.timetable_watcher.className}\n\`\`\`\n${lines.join("\n")}\n\`\`\``,
    })
    .catch((e) => console.log("Failed to send webhook"));

  log(LogLevel.INFO, "Changes sent, sending timetable...");

  await generateTimatable(
    timetable,
    Config.json.app.timetable_watcher.className,
    Config.json.app.timetable_watcher.timeframe ?? BakaTimetablePeriod.Actual,
  );

  const form = new FormData();

  form.append("file", createReadStream("rozvrh.png"), "rozvrh.png");

  await axios.post(Config.json.app.timetable_watcher.webhook, form, {
    headers: {
      ...form.getHeaders(),
    },
  });

  for (const day of changes) {
    for (const lesson of day) {
      if (lesson.type != "atom") {
        announcedChanges.push(JSON.stringify(lesson));
      }
    }
  }

  log(LogLevel.INFO, "Changes announced.");
}
