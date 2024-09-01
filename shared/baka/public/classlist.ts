import getDom from "../../virtDom/virtual_dom";
import { BakaPublic } from "./request";

export default async function getClassList() {
  const html = await BakaPublic.get("/Timetable/Public");

  const dom = getDom(html.data);

  const select = dom.window.document.querySelector("#selectedClass");

  if (!select) return [];

  const options = select.querySelectorAll("option");

  const classes = [];

  for (const option of options) {
    if (!option.getAttribute("value")) continue;

    classes.push({
      id: option.getAttribute("value"),
      name: option.textContent?.replaceAll("\\n", "").trim() || "",
    });
  }

  return classes;
}
