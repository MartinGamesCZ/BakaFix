import { readFileSync, writeFileSync } from "fs";
import path from "path";
import Handlebars from "handlebars";
import nodeHtmlToImage from "node-html-to-image";

export default async function generateTimatable(
  timetable: any[][],
  className: string,
  timeframe: string,
) {
  const template = readFileSync(
    path.join(process.cwd(), "templates", "discord_baka_timetable.html"),
  );

  const hb = Handlebars.compile(template.toString());

  const dayNames = ["Po", "Út", "St", "Čt", "Pá"];

  const html = hb({
    class: className,
    type:
      timeframe == "Permanent"
        ? "Stálý"
        : timeframe == "Actual"
          ? "Aktuální"
          : "Následující týden",
    days: timetable.map((d: any[], i) => ({
      name: dayNames[i],
      lessons: d
        .filter((_, i) => i < 11)
        .map((l) => ({
          subject: l.details.removedinfo
            ? l.details.removedinfo.split("(")[1].split(",")[0]
            : l.subject,
          type:
            l.subject && !l.subject.includes("Odp") ? l.details.type : "free",
        })),
    })),
  });

  const img = await nodeHtmlToImage({
    html,
  });

  writeFileSync("rozvrh.png", img.toString("base64"), "base64");
}
