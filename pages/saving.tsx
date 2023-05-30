import { Container } from "@components/ui";
import Head from "next/head";
import { useState } from "react";

export default function Saving({}) {
  const [currentSavings, setCurrentSavings] = useState(0);
  const [inflationRate, setInflationRate] = useState(0);
  const [annualSavingsDeposit, setAnnualSavingsDeposit] = useState(0);
  const [yearsUntilRetirement, setYearsUntilRetirement] = useState(1);
  const [savingsInvested, setSavingsInvested] = useState(0);
  const [investmentReturnPercentage, setInvestmentReturnPercentage] =
    useState(0);
  const [investments, setInvestments] = useState<
    {
      savings: number;
      interest: number;
    }[]
  >([]);
  const currentYear = new Date().getFullYear();

  const calculate = (yearIndex: number) => {
    return (
      currentSavings +
      savingsInvested *
        Math.pow(1 + investmentReturnPercentage / 100, yearIndex) +
      annualSavingsDeposit * yearIndex
    );
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
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="current-savings"
                >
                  Current Savings
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="current-savings"
                  type="number"
                  placeholder="Current Savings"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(+e.target.value)}
                />
                <p className="text-gray-600 text-xs italic">
                  Enter your current savings
                </p>
              </div>
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="inflation-rate"
                >
                  Inflation Rate
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="inflation-rate"
                  type="number"
                  placeholder="Inflation Rate"
                  value={inflationRate}
                  step={0.01}
                  onChange={(e) => setInflationRate(+e.target.value)}
                />
                <p className="text-gray-600 text-xs italic">
                  Enter the inflation rate
                </p>
              </div>
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="inflation-rate"
                >
                  Annual Savings Deposit
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="inflation-rate"
                  type="number"
                  placeholder="Annual Savings Deposit"
                  value={annualSavingsDeposit}
                  step={0.01}
                  onChange={(e) => setAnnualSavingsDeposit(+e.target.value)}
                />
                <p className="text-gray-600 text-xs italic">
                  Enter the Annual Savings Deposit
                </p>
              </div>
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="years-until-retirement"
                >
                  Years Until Retirement
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="years-until-retirement"
                  type="number"
                  placeholder="Years Until Retirement"
                  value={yearsUntilRetirement}
                  onChange={(e) => setYearsUntilRetirement(+e.target.value)}
                />
                <p className="text-gray-600 text-xs italic">
                  Enter the Years Until Retirement
                </p>
              </div>
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="savings-invested"
                >
                  Savings Invested
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="savings-invested"
                  type="number"
                  placeholder="Savings Invested"
                  value={savingsInvested}
                  onChange={(e) => setSavingsInvested(+e.target.value)}
                />
                <p className="text-gray-600 text-xs italic">
                  Enter the Savings Invested
                </p>
              </div>
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="investment-return-percentage"
                >
                  Investment Return Percentage
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="investment-return-percentage"
                  type="number"
                  placeholder="Investment Return Percentage"
                  value={investmentReturnPercentage}
                  step={0.01}
                  onChange={(e) =>
                    setInvestmentReturnPercentage(+e.target.value)
                  }
                />
                <p className="text-gray-600 text-xs italic">
                  Enter the Investment Return Percentage
                </p>
              </div>
            </div>
            <hr />
            <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"></div>
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
