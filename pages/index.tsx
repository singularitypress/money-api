import { Transaction } from "@types";
import { monthlySpendingPerYear } from "@utils";
import axios from "axios";
import { ResponsiveLine } from "@nivo/line";

interface Props {
  data: Transaction[];
  monthlySpendingPerYear: {
    id: string;
    data: {
      x: string;
      y: number;
    }[];
  }[];
  monthlyPayrollPerYear: {
    id: string;
    data: {
      x: string;
      y: number;
    }[];
  }[];
}

export default function Home({
  data,
  monthlySpendingPerYear,
  monthlyPayrollPerYear,
}: Props) {
  const payees = [...new Set(data.map((transaction) => transaction.desc))].sort(
    (a, b) => a.localeCompare(b),
  );
  return (
    <>
      <h1>Home</h1>
      <h2>Nivo line chart for Monthly Payroll</h2>
      <div className="w-screen h-screen">
        <div className="w-full h-3/4">
          <ResponsiveLine
            data={monthlyPayrollPerYear}
            colors={[
              "hsl(0, 70%, 50%)",
              "hsl(40, 70%, 50%)",
              "hsl(80, 70%, 50%)",
              "hsl(120, 70%, 50%)",
              "hsl(160, 70%, 50%)",
              "hsl(200, 70%, 50%)",
              "hsl(240, 70%, 50%)",
              "hsl(280, 70%, 50%)",
            ]}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              reverse: false,
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "month",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "count",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
      <h2>Nivo line chart for Monthly Spending</h2>
      <div className="w-screen h-screen">
        <div className="w-full h-3/4">
          <ResponsiveLine
            data={monthlySpendingPerYear}
            colors={[
              "hsl(0, 70%, 50%)",
              "hsl(40, 70%, 50%)",
              "hsl(80, 70%, 50%)",
              "hsl(120, 70%, 50%)",
              "hsl(160, 70%, 50%)",
              "hsl(200, 70%, 50%)",
              "hsl(240, 70%, 50%)",
              "hsl(280, 70%, 50%)",
            ]}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              reverse: false,
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "month",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "count",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
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
      data: (spending as Transaction[]).sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
      monthlySpendingPerYear: Object.keys(monthlySpendingPerYear(spending)).map(
        (year) => ({
          id: year,
          data: Object.keys(monthlySpendingPerYear(spending)[year]).map(
            (month) => ({
              x: monthName(Number(month) - 1),
              y: (monthlySpendingPerYear(spending)[year][month] * -1).toFixed(
                2,
              ),
            }),
          ),
        }),
      ),
      monthlyPayrollPerYear: Object.keys(monthlySpendingPerYear(payroll)).map(
        (year) => ({
          id: year,
          data: Object.keys(monthlySpendingPerYear(payroll)[year]).map(
            (month) => ({
              x: monthName(Number(month) - 1),
              y: monthlySpendingPerYear(payroll)[year][month].toFixed(2),
            }),
          ),
        }),
      ),
    },
  };
}
