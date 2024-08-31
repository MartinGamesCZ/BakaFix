import { JSDOM } from "jsdom";

export default function getDom(html: string) {
  return new JSDOM(html);
}
