import getTimetable from "../shared/baka/public/timetable";
import {
  BakaTimetablePeriod,
  BakaTimetableType,
} from "../shared/types/baka/timetable";

const updateInterval = 10 * 60 * 1000; // 10 minutes

export async function _start() {
  check();

  setInterval(check, updateInterval);
}

async function check() {
  const timetable = await getTimetable(
    BakaTimetablePeriod.Next,
    BakaTimetableType.Class,
    "66",
  );

  const changes = timetable.map((d) =>
    d.filter((l) => {
      return l.details.type && l.details.type != "atom";
    }),
  );

  console.log(changes);
}
