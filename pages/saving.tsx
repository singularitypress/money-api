import { Input } from "@components/form";
import { Container } from "@components/ui";
import axios from "axios";
import { GetStaticProps } from "next";
import Head from "next/head";
import { Fragment, useState } from "react";

const currentYear = new Date().getFullYear();

export default function Saving({
  cpiYtd,
}: {
  cpiYtd: {
    d: string;
    STATIC_TOTALCPICHANGE: number;
  }[];
}) {
  const [inflationRate, setInflationRate] = useState(
    cpiYtd.length > 0 ? cpiYtd[cpiYtd.length - 1].STATIC_TOTALCPICHANGE : 0,
  );
  const [yearsUntilRetirement, setYearsUntilRetirement] = useState(30);
  const [investments, setInvestments] = useState<
    {
      id: string;
      savings: number;
      interest: number;
      annualSavingsDeposit: number;
    }[]
  >([]);

  const calculate = (yearIndex: number) => {
    const investmentsTotal = investments.reduce((acc, investment) => {
      return (
        acc +
        (investment.savings + investment.annualSavingsDeposit) *
          Math.pow(1 + investment.interest / 100, yearIndex)
      );
    }, 0);

    return investmentsTotal;
  };

  return (
    <>
      <Head>
        <title>Saving</title>
      </Head>
      {/* Grid-based tailwindcss form that takes in your current savings and inflation rate */}
      <Container>
        <div className="my-8 grid gap-4">
          <form className="w-full grid gap-4">
            <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Input
                label="Inflation Rate"
                name="inflation-rate"
                value={inflationRate}
                onChange={(e) => setInflationRate(+e.target.value)}
                description="Enter the inflation rate"
                type="number"
                step={0.01}
              />
              <Input
                label="Years Until Retirement"
                name="years-until-retirement"
                value={yearsUntilRetirement}
                onChange={(e) => setYearsUntilRetirement(+e.target.value)}
                description="Enter the years until retirement"
                type="number"
              />
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <button
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={(e) => {
                  e.preventDefault();
                  setInvestments([
                    ...investments,
                    {
                      id: `${Math.random()}`,
                      savings: 0,
                      interest: 0,
                      annualSavingsDeposit: 0,
                    },
                  ]);
                }}
              >
                Add Savings
              </button>
            </div>
            {investments.map((investment) => {
              return (
                <div className="w-full grid gap-4" key={investment.id}>
                  <strong>Investment {investment.id}</strong>
                  <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Input
                      label="Investment Savings"
                      name="investment-savings"
                      value={investment.savings}
                      onChange={(e) => {
                        const newInvestments = investments.map((i) => {
                          if (i.id === investment.id) {
                            return {
                              ...i,
                              savings: +e.target.value,
                            };
                          }
                          return i;
                        });
                        setInvestments(newInvestments);
                      }}
                      description="Enter the investment savings"
                      type="number"
                      step={0.01}
                    />
                    <Input
                      label="Investment Interest/ Return"
                      name="investment-interest"
                      value={investment.interest}
                      onChange={(e) => {
                        const newInvestments = investments.map((i) => {
                          if (i.id === investment.id) {
                            return {
                              ...i,
                              interest: +e.target.value,
                            };
                          }
                          return i;
                        });
                        setInvestments(newInvestments);
                      }}
                      description="Enter the investment interest"
                      type="number"
                      step={0.01}
                    />
                    <Input
                      label="Investment Annual Savings Deposit"
                      name="investment-annual-savings-deposit"
                      value={investment.annualSavingsDeposit}
                      onChange={(e) => {
                        const newInvestments = investments.map((i) => {
                          if (i.id === investment.id) {
                            return {
                              ...i,
                              annualSavingsDeposit: +e.target.value,
                            };
                          }
                          return i;
                        });
                        setInvestments(newInvestments);
                      }}
                      description="Enter the investment annual savings deposit"
                      type="number"
                      step={0.01}
                    />
                    <div>
                      <button
                        className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded"
                        onClick={(e) => {
                          e.preventDefault();
                          const newInvestments = investments.filter(
                            (i) => i.id !== investment.id,
                          );
                          setInvestments(newInvestments);
                        }}
                      >
                        Remove Investment
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            <hr />
          </form>
          {/* Display the value of savings adjusted for inflation over 50 years in a tailwindcss table for every year. */}
          <div className="flex flex-col w-full flex-1 ">
            <table className="table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Year</th>
                  <th className="px-4 py-2">Savings Adjusted for Inflation</th>
                  <th className="px-4 py-2">Non-Adjusted Nominal Savings</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: yearsUntilRetirement }, (_, i) => {
                  const yearIndex = i + 1;
                  return (
                    <tr key={i}>
                      <td className="border px-4 py-2">
                        {yearIndex} ({currentYear + yearIndex})
                      </td>
                      <td className="border px-4 py-2">
                        $
                        {(
                          calculate(yearIndex) *
                          Math.pow(1 - inflationRate / 100, i)
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                          currency: "CAD",
                        })}
                      </td>
                      <td className="border px-4 py-2">
                        $
                        {calculate(yearIndex).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                          currency: "CAD",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  let cpi = [] as {
    STATIC_TOTALCPICHANGE: number;
    d: string;
  }[];
  try {
    const {
      data: { data },
    } = await axios.post(`${process.env.API_URL}/graphql`, {
      query: /* GraphQL */ `
        {
          cpi(endDate: "2023-12-31") {
            STATIC_TOTALCPICHANGE
            d
          }
        }
      `,
    });
    cpi = data.cpi;
  } catch (error) {
    console.warn(error);
  }

  return {
    props: {
      cpiYtd: cpi,
    },
  };
};
