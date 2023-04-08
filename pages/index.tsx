import { Transaction } from "@types";
import { monthlyAmountPerYear, spendingByPayee } from "@utils";
import axios from "axios";
import { SegmentedControl } from "@components/form";
import { useState } from "react";
import { LineChart, PieChart } from "@components/charts";
import { Modal } from "@components/ui";

interface Props {
  data: Transaction[];
  monthlySpendingPerYear: {
    id: string;
    data: {
      x: string;
      y: number;
      transactions: Transaction[];
    }[];
  }[];
  monthlyPayrollPerYear: {
    id: string;
    data: {
      x: string;
      y: number;
      transactions: Transaction[];
    }[];
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

export default function Home({
  monthlySpendingPerYear,
  monthlyPayrollPerYear,
}: Props) {
  const [spendingType, setSpendingType] = useState<ChartType>(
    "Monthly Amount Per Year",
  );
  const [payrollType, setPayrollType] = useState<ChartType>(
    "Monthly Amount Per Year",
  );
  const [modalVisible, setModalVisible] = useState(false);

  const chartData = {
    monthlySpendingPerYear: {
      "Monthly Amount Per Year": monthlySpendingPerYear,
      "Monthly Amount": [convertToMonthly(monthlySpendingPerYear)],
    },
    monthlyPayrollPerYear: {
      "Monthly Amount Per Year": monthlyPayrollPerYear,
      "Monthly Amount": [convertToMonthly(monthlyPayrollPerYear)],
    },
  };

  const [selectedTransactions, setSelectedTransactions] = useState<
    Transaction[]
  >([]);

  return (
    <>
      <h1>Home</h1>
      <div className="h-screen">
        <h2>Nivo line chart for Monthly Spending</h2>
        <SegmentedControl
          options={["Monthly Amount Per Year", "Monthly Amount"] as ChartType[]}
          value={spendingType}
          onClick={(e) => {
            console.log(e.currentTarget.value);
            setSpendingType(e.currentTarget.value as ChartType);
          }}
        />
        <div className="w-full h-96">
          <LineChart
            data={chartData.monthlySpendingPerYear[spendingType]}
            onClick={(d) => {
              setSelectedTransactions((d.data as any).transactions);
              setModalVisible(true);
            }}
          />
        </div>
        <h2>Nivo line chart for Monthly Payroll</h2>
        <SegmentedControl
          options={["Monthly Amount Per Year", "Monthly Amount"] as ChartType[]}
          value={payrollType}
          onClick={(e) => {
            setPayrollType(e.currentTarget.value as ChartType);
          }}
        />
        <div className="w-full h-96">
          <LineChart
            data={chartData.monthlyPayrollPerYear[payrollType]}
            onClick={(d) => {
              setSelectedTransactions((d.data as any).transactions);
              setModalVisible(true);
            }}
          />
        </div>
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
      data: { spending, payroll },
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
          amt
          desc
          date
          institution
          account
        }
        payroll: transactions(
          maxAmt: "10000000.00"
          minAmt: "0.00"
          startDate: "2020-01-01"
          endDate: "2023-12-31"
          desc: ${process.env.PAYROLL_TRANSACTIONS}
        ) {
          amt
          desc
          date
          institution
          account
        }
      }
    `,
  });

  const monthName = (month: number) => {
    const date = new Date(2020, month, 1);
    return date.toLocaleString("default", { month: "long" });
  };

  return {
    props: {
      monthlySpendingPerYear: Object.keys(monthlyAmountPerYear(spending)).map(
        (year) => ({
          id: year,
          data: Object.keys(monthlyAmountPerYear(spending)[year]).map(
            (month) => ({
              x: monthName(Number(month) - 1),
              y: (monthlyAmountPerYear(spending)[year][month].amt * -1).toFixed(
                2,
              ),
              transactions:
                monthlyAmountPerYear(spending)[year][month].transactions,
            }),
          ),
        }),
      ),
      monthlyPayrollPerYear: Object.keys(monthlyAmountPerYear(payroll)).map(
        (year) => ({
          id: year,
          data: Object.keys(monthlyAmountPerYear(payroll)[year]).map(
            (month) => ({
              x: monthName(Number(month) - 1),
              y: monthlyAmountPerYear(payroll)[year][month].amt.toFixed(2),
              transactions:
                monthlyAmountPerYear(payroll)[year][month].transactions,
            }),
          ),
        }),
      ),
    },
  };
}
