import axios from "axios";
import Config from "../../../config/config";

export const BakaPublic = axios.create({
  baseURL: Config.json.baka.public.baseURL,
});
