import { Transaction } from "@types";
import { monthlyAmountPerYear } from "@utils";
import axios from "axios";
import { SegmentedControl } from "@components/form";
import { useState } from "react";
import { LineChart } from "@components/charts";

interface Props {
  data: Transaction[];
  monthlySpendingPerYear: {
    id: string;
    data: {
      x: string;
      y: number;
      desc: string[];
    }[];
  }[];
  monthlyPayrollPerYear: {
    id: string;
    data: {
      x: string;
      y: number;
      desc: string[];
    }[];
  }[];
}

type ChartType = "Monthly Amount Per Year" | "Monthly Amount";

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

  const chartData = {
    monthlySpendingPerYear: {
      "Monthly Amount Per Year": monthlySpendingPerYear,
      "Monthly Amount": [
        monthlySpendingPerYear.reduce(
          (acc, curr) => {
            return {
              ...acc,
              data: [
                ...acc.data,
                ...curr.data.map((data) => ({
                  x: `${curr.id}-${data.x}`,
                  y: data.y,
                  desc: data.desc,
                })),
              ],
            };
          },
          {
            id: "Monthly Amount",
            color: "hsl(0, 70%, 50%)",
            data: [],
          } as {
            id: string;
            color: string;
            data: {
              x: string;
              y: number;
              desc: string[];
            }[];
          },
        ),
      ],
    },
    monthlyPayrollPerYear: {
      "Monthly Amount Per Year": monthlyPayrollPerYear,
      "Monthly Amount": [
        monthlyPayrollPerYear.reduce(
          (acc, curr) => {
            return {
              ...acc,
              data: [
                ...acc.data,
                ...curr.data.map((data) => ({
                  x: `${curr.id}-${data.x}`,
                  y: data.y,
                  desc: data.desc,
                })),
              ],
            };
          },
          {
            id: "Monthly Amount",
            color: "hsl(0, 70%, 50%)",
            data: [],
          } as {
            id: string;
            color: string;
            data: {
              x: string;
              y: number;
              desc: string[];
            }[];
          },
        ),
      ],
    },
  };

  return (
    <>
      <h1>Home</h1>
      <div className="w-screen h-screen">
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
          <LineChart data={chartData.monthlySpendingPerYear[spendingType]} />
        </div>
        <h2>Nivo line chart for Monthly Payroll</h2>
        <SegmentedControl
          options={["Monthly Amount Per Year", "Monthly Amount"] as ChartType[]}
          value={payrollType}
          onClick={(e) => {
            console.log(e.currentTarget.value);
            setPayrollType(e.currentTarget.value as ChartType);
          }}
        />
        <div className="w-full h-96">
          <LineChart data={chartData.monthlyPayrollPerYear[payrollType]} />
        </div>
      </div>
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

  // use toLocaleString to get the month name
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
              desc: monthlyAmountPerYear(spending)[year][month].desc,
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
              desc: monthlyAmountPerYear(payroll)[year][month].desc,
            }),
          ),
        }),
      ),
    },
  };
}
