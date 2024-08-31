import axios from "axios";
import { BakaPublic } from "./request";
import type {
  BakaTimetablePeriod,
  BakaTimetableType,
} from "../../types/baka/timetable";
import getDom from "../../virtDom/virtual_dom";

export default async function getTimetable(
  period: BakaTimetablePeriod,
  type: BakaTimetableType,
  id: string,
) {
  const page = await BakaPublic.get(
    `/Timetable/Public/${period}/${type}/${id}`,
  );

  const dom = getDom(page.data);

  const dayElements = dom.window.document.querySelectorAll(".bk-cell-wrapper");

  const days = [];

  for (const dayElement of dayElements) {
    const day = getCells(dayElement);

    days.push(day);
  }

  return days;
}

function getCells(day: Element) {
  const cells = day.querySelectorAll(".bk-timetable-cell");

  const cellsData = [];

  for (const cell of cells) {
    const detail = cell
      .querySelector(".day-item-hover")
      ?.getAttribute("data-detail");

    const cellData = {
      subject: cell.querySelector(".middle")?.textContent,
      details: detail ? JSON.parse(detail) : {},
    };

    cellsData.push(cellData);
  }

  return cellsData;
}
