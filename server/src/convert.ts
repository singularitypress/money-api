import { readFileSync, readdirSync } from "fs";
import csv from "csvtojson/v2";
import { join, resolve } from "path";
import { config } from "dotenv";
config();

const dir = process.env.FILES_DIR ?? "";

interface Transaction {
  date: string;
  desc: string;
  amt: number;
  institution: string;
  account: string;
  info: string;
  debit?: string;
  credit?: string;
}

export const convert = async () => {

  if (!dir) {
    console.log(resolve("server", "sample", "transactions.json"))
    return JSON.parse(
      readFileSync(resolve("server", "sample", "transactions.json"), {
        encoding: "utf8",
      }),
    );
  }

  const files = readdirSync(dir);
  const converted = await Promise.all(
    files.map(async (file) => {
      const [institution, account, info = ""] = file
        .replace(/\.csv/g, "")
        .split("_");
      const data = (await csv().fromFile(join(dir, file))).reduce(
        (acc, curr) => {
          const { date } = curr;
          let amt = curr?.amt;
          if (!amt) {
            const { debit, credit } = curr;
            amt = debit || `-${credit}`;
          }

          return [
            ...acc,
            {
              ...curr,
              institution,
              account,
              info,
              date: new Date(date).toLocaleString("en-US", {
                timeZone: "America/New_York",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
              amt: parseFloat(amt),
            },
          ];
        },
        [],
      );
      return data;
    }),
  );
  return [].concat(...converted) as Transaction[];
};
