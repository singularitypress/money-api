import { Container } from "@components/ui";
import { AmortizationTableRow } from "@types";
import { calculateAmortizationTable } from "@utils";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";

export default function MortgageStats({}) {
  const inputClasses = "border border-gray-300 p-2 rounded-md";
  const labelClasses = "text-sm font-bold mb-1";
  const selectClasses = "border border-gray-300 p-2 rounded-md";
  const formClasses =
    "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mb-8";

  const [principal, setPrincipal] = useState(400000);
  const [interest, setInterest] = useState(0.065);
  const [term, setTerm] = useState(360);
  const [paymentFrequency, setPaymentFrequency] = useState(12);
  const [startDate, setStartDate] = useState(new Date());

  const [amortization, setAmortization] = useState<AmortizationTableRow[]>(
    calculateAmortizationTable(
      principal,
      interest,
      term,
      paymentFrequency,
      startDate
    )
  );

  useEffect(() => {
    setAmortization(
      calculateAmortizationTable(
        principal,
        interest,
        term,
        paymentFrequency,
        startDate
      )
    );
  }, [principal, interest, term, paymentFrequency, startDate]);

  return (
    <>
      <Head>
        <title>Mortgage Stats</title>
      </Head>
      <Container>
        <h1 className="text-3xl font-bold my-8">Mortgage Stats</h1>
        <form className={formClasses}>
          <div className="flex flex-col">
            <label className={labelClasses} htmlFor="principal">
              Principal
            </label>
            <input
              className={inputClasses}
              type="number"
              name="principal"
              id="principal"
              placeholder="100000"
              step={0.01}
              value={principal}
              onChange={(e) => setPrincipal(parseFloat(e.target.value))}
            />
          </div>
          <div className="flex flex-col">
            <label className={labelClasses} htmlFor="interest">
              Interest
            </label>
            <input
              className={inputClasses}
              type="number"
              name="interest"
              id="interest"
              placeholder="0.05"
              value={interest}
              onChange={(e) => setInterest(parseFloat(e.target.value))}
            />
          </div>
          <div className="flex flex-col">
            <label className={labelClasses} htmlFor="term">
              Term (in months)
            </label>
            <input
              className={inputClasses}
              type="number"
              name="term"
              id="term"
              placeholder="360"
              value={term}
              onChange={(e) => setTerm(parseFloat(e.target.value))}
            />
          </div>
          <div className="flex flex-col">
            <label className={labelClasses} htmlFor="payment-frequency">
              Payment Frequency
            </label>
            <select
              className={selectClasses}
              name="payment-frequency"
              id="payment-frequency"
              value={paymentFrequency}
              onChange={(e) => setPaymentFrequency(parseFloat(e.target.value))}
            >
              <option value={12}>Monthly</option>
              <option value={26}>Bi-Weekly</option>
              <option value={52}>Weekly</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className={labelClasses} htmlFor="start-date">
              Start Date
            </label>
            <input
              className={inputClasses}
              type="date"
              name="start-date"
              id="start-date"
              value={startDate.toISOString().split("T")[0]}
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>
        </form>
        <details className="mb-8">
          <summary className="text-xl font-bold cursor-pointer">
            Amortization Table
          </summary>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Payment #</th>
                <th className="px-4 py-2">Payment Date</th>
                <th className="px-4 py-2">Payment Amount</th>
                <th className="px-4 py-2">Principal</th>
                <th className="px-4 py-2">Interest</th>
                <th className="px-4 py-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {amortization.map((row) => (
                <tr key={row.paymentNumber}>
                  <td className="border px-4 py-2">{row.paymentNumber}</td>
                  <td className="border px-4 py-2">
                    {row.paymentDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="border px-4 py-2">{row.payment.toFixed(2)}</td>
                  <td className="border px-4 py-2">
                    {row.principal.toFixed(2)}
                  </td>
                  <td className="border px-4 py-2">
                    {row.interest.toFixed(2)}
                  </td>
                  <td className="border px-4 py-2">{row.balance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
        {/* use grid tailwindcss */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mb-8">
          <div className="flex flex-col">
            <label className={labelClasses} htmlFor="total-interest">
              Total Interest
            </label>
            <input
              className={inputClasses}
              type="number"
              name="total-interest"
              id="total-interest"
              value={amortization
                .reduce((acc, row) => acc + row.interest, 0)
                .toFixed(2)}
              readOnly
            />
          </div>
          <div className="flex flex-col">
            <label className={labelClasses} htmlFor="total-principal">
              Total Principal
            </label>
            <input
              className={inputClasses}
              type="number"
              name="total-principal"
              id="total-principal"
              value={amortization
                .reduce((acc, row) => acc + row.principal, 0)
                .toFixed(2)}
              readOnly
            />
          </div>
          <div className="flex flex-col">
            <label className={labelClasses} htmlFor="total-payments">
              Total Payments
            </label>
            <input
              className={inputClasses}
              type="number"
              name="total-payments"
              id="total-payments"
              value={amortization
                .reduce((acc, row) => acc + row.payment, 0)
                .toFixed(2)}
              readOnly
            />
          </div>
          {/* Calculated payment per month based on Total Payments */}
          <div className="flex flex-col">
            <label className={labelClasses} htmlFor="payment">
              Payment Averaged Per Month
            </label>
            <input
              className={inputClasses}
              type="number"
              name="payment"
              id="payment"
              value={(
                (amortization[0]?.payment * paymentFrequency) /
                12
              ).toFixed(2)}
              readOnly
            />
          </div>
        </div>
        <details className="mb-8">
          <summary className="text-xl font-bold cursor-pointer">
            Bar Chart
          </summary>
          <div className="w-full h-96">
            <ResponsiveBar
              data={
                // every 12th payment
                amortization
                  .filter((row) => row.paymentNumber % paymentFrequency === 0)
                  .map((row) => ({
                    paymentNumber: row.paymentNumber,
                    principal: row.principal,
                    interest: row.interest,
                  }))
              }
              keys={["principal", "interest"]}
              indexBy="paymentNumber"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
              padding={0.3}
              valueScale={{ type: "linear" }}
              indexScale={{ type: "band", round: true }}
              colors={{ scheme: "nivo" }}
              borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Payment #",
                legendPosition: "middle",
                legendOffset: 32,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Amount",
                legendPosition: "middle",
                legendOffset: -40,
              }}
              label={""}
              tooltip={({ id, value, color, data }) => (
                <div className="bg-white p-4 shadow-lg rounded-lg flex items-center justify-center">
                  <div
                    className="w-8 h-8 rounded-full mr-4"
                    style={{ backgroundColor: color }}
                  ></div>
                  <strong>
                    {id}: ${value.toFixed(2)}
                    <br />
                    total: ${(data.principal + data.interest).toFixed(2)}
                  </strong>
                </div>
              )}
              legends={[
                {
                  dataFrom: "keys",
                  anchor: "bottom-right",
                  direction: "column",
                  justify: false,
                  translateX: 120,
                  translateY: 0,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: "left-to-right",
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: "hover",
                      style: {
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]}
            />
          </div>
        </details>
      </Container>
    </>
  );
}
