import { readFileSync, readdirSync } from "fs";
import csv from "csvtojson/v2";
import { join, resolve } from "path";
import { config } from "dotenv";
import { Transaction } from "@types";
import { sanitizePayee } from "./sanitize-payee";
config();

const dir = resolve("db");

export const convert = async (): Promise<Transaction[]> => {
  const files = readdirSync(dir).filter((file) => file.endsWith(".csv"));

  if (files.length === 0) {
    return JSON.parse(
      readFileSync(resolve("server", "sample", "transactions.json"), {
        encoding: "utf8",
      })
    );
  }

  const converted = await Promise.all(
    files.map(async (file) => {
      const [institution, account, info = ""] = file
        .replace(/\.csv/g, "")
        .split("_");
      const data = (await csv().fromFile(join(dir, file))).reduce(
        (acc: Transaction[], curr: Transaction) => {
          const { date } = curr;
          let amt = curr?.amt;
          if (!amt) {
            const { debit, credit } = curr;
            amt = parseFloat(debit || `-${credit}`);
          }

          /**
           * Check if a desc with the first 6 alphanumeric characters of the current desc exists in acc already,
           * and if so, use that desc instead of the current desc.
           */
          const prev = acc.find(
            (t) =>
              sanitizePayee(t.desc)
                .replace(/[^a-zA-Z0-9]/g, "")
                .substring(0, 8) ===
              sanitizePayee(curr.desc)
                .replace(/[^a-zA-Z0-9]/g, "")
                .substring(0, 8)
          );

          return [
            ...acc,
            {
              ...curr,
              institution,
              account,
              info,
              desc: prev?.desc || sanitizePayee(curr.desc),
              date: new Date(date).toLocaleString("en-US", {
                timeZone: "America/New_York",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
              amt,
            },
          ];
        },
        []
      );
      return data;
    })
  );
  return [].concat(...converted) as Transaction[];
};
