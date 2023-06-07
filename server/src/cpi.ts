import { CPIObservation, CPIResponse } from "@types";
import axios, { AxiosResponse } from "axios";
import { readFile, readFileSync, writeFile, writeFileSync } from "fs";

export const getCPI = async () => {
  try {
    const cpiCache = readFileSync("db/cpi.json", { encoding: "utf8" });
    return JSON.parse(cpiCache) as CPIResponse;
  } catch (e) {
    const { data }: AxiosResponse<CPIResponse> = await axios.get(
      "https://www.bankofcanada.ca/valet/observations/group/CPI_MONTHLY/json",
    );

    writeFileSync("db/cpi.json", JSON.stringify(data));

    return data;
  }
};
