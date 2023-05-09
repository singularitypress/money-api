import { Transaction } from "@types";
import { monthlyAmountPerYear, spendingByPayee } from "@utils";
import axios from "axios";
import { SegmentedControl } from "@components/form";
import { useState } from "react";
import { LineChart, PieChart } from "@components/charts";
import { Container, Modal } from "@components/ui";

interface Props {
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
  }[]
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
    }
  );
};

export default function Home({ monthlyPayrollPerYear }: Props) {
  const [payrollType, setPayrollType] = useState<ChartType>(
    "Monthly Amount Per Year"
  );
  const [modalVisible, setModalVisible] = useState(false);

  const chartData = {
    "Monthly Amount Per Year": monthlyPayrollPerYear,
    "Monthly Amount": [convertToMonthly(monthlyPayrollPerYear)],
  };

  const [selectedTransactions, setSelectedTransactions] = useState<
    Transaction[]
  >([]);

  return (
    <>
      <Container>
        <h1>Home</h1>
        <div className="h-screen">
          <h2>Nivo line chart for Monthly Payroll</h2>
          <SegmentedControl
            options={
              ["Monthly Amount Per Year", "Monthly Amount"] as ChartType[]
            }
            value={payrollType}
            onClick={(e) => {
              setPayrollType(e.currentTarget.value as ChartType);
            }}
          />
          <div className="w-full h-96">
            <LineChart
              data={chartData[payrollType]}
              onClick={(d) => {
                setSelectedTransactions((d.data as any).transactions);
                setModalVisible(true);
              }}
            />
          </div>
        </div>
      </Container>
      <Modal visible={modalVisible} toggleVisibility={setModalVisible}>
        <h1>Modal</h1>
        <div className="h-screen">
          <PieChart
            data={Object.keys(spendingByPayee(selectedTransactions))
              .map((payee, index) => ({
                id: payee,
                value: Math.abs(
                  Number(
                    spendingByPayee(selectedTransactions)[payee].amt.toFixed(2)
                  )
                ),
                label: payee,
                color: `hsl(${index * 10}, 70%, 50%)`,
              }))
              .sort(
                (a, b) =>
                  spendingByPayee(selectedTransactions)[a.id].amt -
                  spendingByPayee(selectedTransactions)[b.id].amt
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
      data: { payroll },
    },
  } = await axios.post(`${process.env.API_URL}/graphql`, {
    query: /* GraphQL */ `
      query {
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
      monthlyPayrollPerYear: Object.keys(monthlyAmountPerYear(payroll)).map(
        (year) => ({
          id: year,
          data: Object.keys(monthlyAmountPerYear(payroll)[year]).map(
            (month) => ({
              x: monthName(Number(month) - 1),
              y: monthlyAmountPerYear(payroll)[year][month].amt.toFixed(2),
              transactions:
                monthlyAmountPerYear(payroll)[year][month].transactions,
            })
          ),
        })
      ),
    },
  };
}
