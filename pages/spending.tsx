import { Transaction } from "@types";
import {
  convertToMonthly,
  convertToTransactionSerie,
  monthlyAmountPerYear,
  spendingByPayee,
} from "@utils";
import axios from "axios";
import { SegmentedControl } from "@components/form";
import { useEffect, useMemo, useState } from "react";
import { LineChart, PieChart } from "@components/charts";
import { Modal } from "@components/ui";
import Select from "react-select";
import Head from "next/head";

interface Props {
  data: Transaction[];
  descList: string[];
}

type ChartType = "Monthly Amount Per Year" | "Monthly Amount";

export default function Home({ data, descList }: Props) {
  const [spendingType, setSpendingType] = useState<ChartType>(
    "Monthly Amount Per Year",
  );
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedExclusion, setSelectedExclusion] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const [selectedInclusion, setSelectedInclusion] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const [selectedTransactions, setSelectedTransactions] = useState<
    Transaction[]
  >([]);

  const filteredData = useMemo(() => {
    return (
      data
        // filter for inclusion
        .filter((d) => {
          if (selectedInclusion.length === 0) return true;
          return selectedInclusion.some((e) => d.desc.includes(e.value));
        })
        // filter for exclusion
        .filter((d) => {
          if (selectedExclusion.length === 0) return true;
          return !selectedExclusion.some((e) => d.desc.includes(e.value));
        })
    );
  }, [data, selectedExclusion, selectedInclusion]);

  const chartData = {
    "Monthly Amount Per Year": (
      <LineChart
        curve="natural"
        data={convertToTransactionSerie(filteredData)}
        onClick={(d) => {
          setSelectedTransactions((d.data as any).transactions);
          setModalVisible(true);
        }}
      />
    ),
    "Monthly Amount": (
      <LineChart
        curve="natural"
        data={[convertToMonthly(convertToTransactionSerie(filteredData))]}
        onClick={(d) => {
          setSelectedTransactions((d.data as any).transactions);
          setModalVisible(true);
        }}
      />
    ),
  };

  useEffect(() => {
    console.log(convertToTransactionSerie(filteredData));
  }, [filteredData]);

  return (
    <>
      <Head>
        <title>Spending</title>
      </Head>
      <h1>Spending</h1>
      <div className="h-screen">
        <h2>Nivo line chart for Monthly Spending</h2>
        <div className="grid grid-cols-3 gap-4">
          <SegmentedControl
            options={
              ["Monthly Amount Per Year", "Monthly Amount"] as ChartType[]
            }
            value={spendingType}
            onClick={(e) => {
              setSpendingType(e.currentTarget.value as ChartType);
            }}
          />
          <Select
            placeholder="Select a description to exclude"
            isMulti
            isSearchable
            options={descList
              .map((desc) => ({ value: desc, label: desc }))
              .sort((a, b) => a.value.localeCompare(b.value))}
            onChange={(e) => setSelectedExclusion([...e])}
            defaultValue={selectedExclusion}
          />
          <Select
            placeholder="Select a description to include"
            isMulti
            isSearchable
            options={descList
              .map((desc) => ({ value: desc, label: desc }))
              .sort((a, b) => a.value.localeCompare(b.value))}
            onChange={(e) => setSelectedInclusion([...e])}
            defaultValue={selectedInclusion}
          />
        </div>
        <div className="w-full h-3/4">{chartData[spendingType]}</div>
      </div>
      <Modal visible={modalVisible} toggleVisibility={setModalVisible}>
        <h1>Modal</h1>
        <div className="h-screen grid grid-rows-2 gap-4">
          <PieChart
            data={Object.keys(spendingByPayee(selectedTransactions))
              .map((payee, index) => ({
                id: payee,
                value: Math.abs(
                  Number(
                    spendingByPayee(selectedTransactions)[payee].amt.toFixed(2),
                  ),
                ),
                label: payee,
                color: `hsl(${index * 10}, 70%, 50%)`,
              }))
              .sort(
                (a, b) =>
                  spendingByPayee(selectedTransactions)[a.id].amt -
                  spendingByPayee(selectedTransactions)[b.id].amt,
              )
              .slice(0, 10)}
          />
          <LineChart
            curve="basis"
            xScale={{
              type: "time",
              format: "%Y-%m-%d",
              precision: "day",
              useUTC: false,
            }}
            data={[
              {
                id: "Daily Amount",
                color: "hsl(0, 70%, 50%)",
                data: selectedTransactions
                  .map((t) => ({
                    x: new Date(t.date),
                    y: t.amt * -1,
                  }))
                  // reduce to merge transactions with same date and sum the amount and fill in missing days
                  .reduce((acc, curr) => {
                    const existing = acc.find(
                      (a) => a.x.getDate() === curr.x.getDate(),
                    );
                    if (existing) {
                      existing.y += curr.y;
                    } else {
                      acc.push(curr);
                    }
                    return acc;
                  }, [] as { x: Date; y: number }[])
                  .sort((a, b) => a.x.getDate() - b.x.getDate()),
              },
            ]}
          />
        </div>
      </Modal>
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
          amt
          date
        }
      }
    `,
  });

  return {
    props: {
      data: spending,
      descList: [...new Set((spending as Transaction[]).map((s) => s.desc))],
    },
  };
}
