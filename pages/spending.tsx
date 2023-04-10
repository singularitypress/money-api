import { Transaction } from "@types";
import { monthlyAmountPerYear, spendingByPayee } from "@utils";
import axios from "axios";
import { SegmentedControl } from "@components/form";
import { useEffect, useMemo, useState } from "react";
import { LineChart, PieChart } from "@components/charts";
import { LoadingSpinner, Modal } from "@components/ui";
import Select from "react-select";

interface Props {
  data: Transaction[];
  descList: string[];
}

interface TransactionsSerie {
  id: string;
  color?: string;
  data: {
    x: string;
    y: number;
    transactions: Transaction[];
  }[];
}

type ChartType = "Monthly Amount Per Year" | "Monthly Amount";

const convertToMonthly = (
  data: {
    id: string;
    data: {
      x: string;
      y: number;
      transactions: Transaction[];
    }[];
  }[],
) => {
  return data.reduce(
    (acc, curr) => {
      return {
        ...acc,
        data: [
          ...acc.data,
          ...curr.data.map((data) => ({
            x: `${curr.id}-${data.x}`,
            y: data.y,
            transactions: data.transactions,
          })),
        ],
      };
    },
    {
      id: "Monthly Amount",
      color: "hsl(0, 70%, 50%)",
      data: [],
      transactions: [],
    } as {
      id: string;
      color: string;
      data: {
        x: string;
        y: number;
        transactions: Transaction[];
      }[];
    },
  );
};

const convertToTransactionSerie = (data: Transaction[]) => {
  const monthName = (month: number) => {
    const date = new Date(2020, month, 1);
    return date.toLocaleString("default", { month: "long" });
  };

  return Object.keys(monthlyAmountPerYear(data)).map((year) => ({
    id: year,
    data: Object.keys(monthlyAmountPerYear(data)[year]).map((month) => ({
      x: monthName(Number(month) - 1),
      y: monthlyAmountPerYear(data)[year][month].amt * -1,
      transactions: monthlyAmountPerYear(data)[year][month].transactions,
    })),
  }));
};

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

  return (
    <>
      <h1>Home</h1>
      <div className="h-screen">
        <h2>Nivo line chart for Monthly Spending</h2>
        <div className="flex flex-row items-center">
          <SegmentedControl
            options={
              ["Monthly Amount Per Year", "Monthly Amount"] as ChartType[]
            }
            value={spendingType}
            onClick={(e) => {
              setSpendingType(e.currentTarget.value as ChartType);
            }}
            className="mr-4"
          />
          <div className="w-1/3 mr-4">
            <Select
              placeholder="Select a description to exclude"
              isMulti
              isSearchable
              options={descList.map((desc) => ({ value: desc, label: desc }))}
              onChange={(e) => setSelectedExclusion([...e])}
              defaultValue={selectedExclusion}
            />
          </div>
          <div className="w-1/3 mr-4">
            <Select
              placeholder="Select a description to include"
              isMulti
              isSearchable
              options={descList.map((desc) => ({ value: desc, label: desc }))}
              onChange={(e) => setSelectedInclusion([...e])}
              defaultValue={selectedInclusion}
            />
          </div>
        </div>
        <div className="w-full h-3/4">{chartData[spendingType]}</div>
      </div>
      <Modal visible={modalVisible} toggleVisibility={setModalVisible}>
        <h1>Modal</h1>
        <div className="h-screen">
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
