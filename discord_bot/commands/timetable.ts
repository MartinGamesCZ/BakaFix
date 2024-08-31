import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
} from "discord.js";
import {
  BakaTimetablePeriod,
  BakaTimetableType,
} from "../../shared/types/baka/timetable";
import getTimetable from "../../shared/baka/public/timetable";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import Handlebars from "handlebars";
import nodeHtmlToImage from "node-html-to-image";

export const data = new SlashCommandBuilder()
  .setName("rozvrh")
  .setDescription("Ukáže rozvrh")
  .addStringOption((o) =>
    o
      .setName("typ")
      .setDescription("Typ rozvrhu")
      .setChoices([
        {
          name: "stálý",
          value: "Permanent",
        },
        {
          name: "aktuální",
          value: "Actual",
        },
        {
          name: "následující týden",
          value: "Next",
        },
      ])
      .setRequired(true),
  );

export async function execute(e: ChatInputCommandInteraction) {
  const type = e.options.getString("typ") as BakaTimetablePeriod;

  e.reply("Načítám rozvrh...");

  const timetable = await getTimetable(type, BakaTimetableType.Class, "66");

  console.log(timetable);

  const template = readFileSync(
    path.join(process.cwd(), "templates", "discord_baka_timetable.html"),
  );

  const hb = Handlebars.compile(template.toString());

  const dayNames = ["Po", "Út", "St", "Čt", "Pá"];

  const html = hb({
    class: "I2B",
    type: "Stálý",
    days: timetable.map((d, i) => ({
      name: dayNames[i],
      lessons: d
        .filter((_, i) => i < 11)
        .map((l) => ({
          subject: l.subject,
          type:
            l.subject && !l.subject.includes("Odp") ? l.details.type : "free",
        })),
    })),
  });

  const img = await nodeHtmlToImage({
    html,
  });

  writeFileSync("rozvrh.png", img.toString("base64"), "base64");

  if (e.channel)
    e.channel.send({
      files: ["rozvrh.png"],
    });
}
