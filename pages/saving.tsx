import { Input } from "@components/form";
import { Container } from "@components/ui";
import axios from "axios";
import { GetStaticProps } from "next";
import Head from "next/head";
import { Fragment, useState } from "react";

export default function Saving({
  cpiYtd,
}: {
  cpiYtd: {
    d: string;
    STATIC_TOTALCPICHANGE: number;
  }[];
}) {
  const [currentSavings, setCurrentSavings] = useState(0);
  const [inflationRate, setInflationRate] = useState(
    cpiYtd.length > 0 ? cpiYtd[cpiYtd.length - 1].STATIC_TOTALCPICHANGE : 0,
  );
  const [annualSavingsDeposit, setAnnualSavingsDeposit] = useState(0);
  const [yearsUntilRetirement, setYearsUntilRetirement] = useState(30);
  const [investments, setInvestments] = useState<
    {
      id: string;
      savings: number;
      interest: number;
    }[]
  >([]);
  const currentYear = new Date().getFullYear();

  const calculate = (yearIndex: number) => {
    const investmentsTotal = investments.reduce((acc, investment) => {
      return (
        acc +
        investment.savings * Math.pow(1 + investment.interest / 100, yearIndex)
      );
    }, 0);

    return currentSavings + investmentsTotal + annualSavingsDeposit * yearIndex;
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
                label="Current Savings"
                name="current-savings"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(+e.target.value)}
                description="Enter your current savings"
                type="number"
              />
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
                label="Annual Savings Deposit"
                name="annual-savings-deposit"
                value={annualSavingsDeposit}
                onChange={(e) => setAnnualSavingsDeposit(+e.target.value)}
                description="Enter the annual savings deposit"
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
                    },
                  ]);
                }}
              >
                Add Investment
              </button>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {investments.map((investment) => {
                return (
                  <Fragment key={investment.id}>
                    <Input
                      label={`Investment Savings ${investment.id}`}
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
                      label={`Investment Interest ${investment.id}`}
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
                    <div></div>
                  </Fragment>
                );
              })}
            </div>
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
