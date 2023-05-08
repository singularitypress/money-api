import { Transaction } from "@types";
import Select from "react-select";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { LineChart } from "@components/charts";
import { Serie } from "@nivo/line";

interface Props {
  descList: string[];
}

/**
 * @description Converts a list of transactions into the total spend per month over the course of many years.
 * @param serie: { x: Date, y: number }[]
 * @returns { x: string, y: number }[]
 */
const convertToMonthly = (serie: { x: string; y: number }[]) => {
  const monthly: { [key: string]: number } = {};
  serie.forEach(({ x, y }) => {
    const date = new Date(x);
    const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (monthly[month]) {
      monthly[month] += y;
    } else {
      monthly[month] = y;
    }
  });

  return Object.keys(monthly)
    .map((key) => ({
      x: new Date(new Date(key).getTime() + 1000 * 60 * 60 * 24),
      y: monthly[key],
    }))
    .sort((a, b) => a.x.getTime() - b.x.getTime());
};

export default function SpendingComparisons({ descList }: Props) {
  const options = descList
    .map((desc, index) => ({
      value: `X${index}`,
      label: desc,
      query: /* GraphQL */ `
    X${index}: transactions(
      startDate: "2020-01-01"
      endDate: "2023-12-31"
      maxAmt: "0.00"
      minAmt: "-1000000.00"
      accounts: [
        "visa"
        "mastercard"
        "amex"
      ]
      desc: "${desc}"
      excludeString: ${process.env.EXCLUDED_TRANSACTIONS}
    ) {
      x: date
      y: amt
    }
  `,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const [data, setData] = useState<Serie[]>([]);

  const [selectedInclusion, setSelectedInclusion] = useState<
    {
      value: string;
      label: string;
      query: string;
    }[]
  >([]);

  useEffect(() => {
    const getData = async () => {
      return await axios.post(`${process.env.API_URL}/graphql`, {
        query: /* GraphQL */ `  
          query {
            ${selectedInclusion.map((item) => item.query).join("\n")}
          }
        `,
      });
    };

    if (selectedInclusion.length > 0) {
      getData().then((res) => {
        const data: Serie[] = [];
        Object.keys(res.data.data).forEach((key) => {
          data.push({
            id: `${options.find((option) => option.value === key)?.label}`,
            data: convertToMonthly(
              res.data.data[key].map(({ x, y }: { x: string; y: number }) => ({
                x,
                y: y * -1,
              }))
            ),
          });
        });
        setData(data);
      });
    }
  }, [selectedInclusion, options]);

  return (
    <>
      <Head>
        <title>Spending Comparisons</title>
      </Head>

      <div className="min-h-screen flex flex-col items-center">
        <div className="container h-full grow">
          <Select
            id="inclusion"
            placeholder="Select a description to include"
            isMulti
            isSearchable
            options={options}
            onChange={(e) => setSelectedInclusion([...e])}
            defaultValue={selectedInclusion}
          />
          <div className="mt-8 h-96">
            <LineChart
              data={data}
              xScale={{
                type: "time",
                format: "%Y-%m-%d",
                precision: "month",
                useUTC: false,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// getStaticProps that fetches data from the GraphQL API from API_URL in .env
export async function getStaticProps() {
  const {
    data: {
      data: { spending },
    },
  } = await axios.post(`${process.env.API_URL}/graphql`, {
    query: /* GraphQL */ `
      query {
        spending: transactions(
          startDate: "2020-01-01"
          endDate: "2023-12-31"
          maxAmt: "0.00"
          minAmt: "-1000000.00"
          accounts: [
            "visa"
            "mastercard"
            "amex"
          ]
          excludeString: ${process.env.EXCLUDED_TRANSACTIONS}
        ) {
          desc
        }
      }
    `,
  });

  return {
    props: {
      descList: [...new Set((spending as Transaction[]).map((s) => s.desc))],
    },
  };
}
