import { Container } from "@components/ui";
import { AmortizationTableRow } from "@types";
import { calculateAmortizationTable } from "@utils";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Input, Select } from "@components/form";

interface ObjectMap {
  [key: string]: string;
}

const options: ObjectMap = {
  "12": "Monthly",
  "26": "Bi-Weekly",
  "52": "Weekly",
};

const currencyConfig = {
  style: "currency",
  currency: "CAD",
};

const locale = "en-CA";

const currencyFormatter = new Intl.NumberFormat(locale, currencyConfig);

export default function MortgageStats() {
  const inputClasses = "border border-gray-300 p-2 rounded-md";
  const labelClasses = "text-sm font-bold mb-1";
  const formClasses =
    "grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mb-8";

  const [principal, setPrincipal] = useState(400000);
  const [interest, setInterest] = useState(0.065);
  const [amortizationPeriod, setAmortizationPeriod] = useState(360);
  const [mortgageTerm, setMortgageTerm] = useState(60);
  const [paymentFrequency, setPaymentFrequency] = useState(12);
  const [startDate, setStartDate] = useState(new Date());

  const [amortization, setAmortization] = useState<AmortizationTableRow[]>(
    calculateAmortizationTable(
      principal,
      interest,
      amortizationPeriod,
      paymentFrequency,
      startDate
    )
  );

  useEffect(() => {
    setAmortization(
      calculateAmortizationTable(
        principal,
        interest,
        amortizationPeriod,
        paymentFrequency,
        startDate
      )
    );
  }, [principal, interest, amortizationPeriod, paymentFrequency, startDate]);

  return (
    <>
      <Head>
        <title>Mortgage Stats</title>
      </Head>
      <Container>
        <h1 className="text-3xl font-bold my-8">Mortgage Stats</h1>
        <form className={formClasses}>
          <Input
            label="Principal"
            type="number"
            name="principal"
            placeholder="100000"
            step={0.01}
            value={principal}
            onChange={(e) => setPrincipal(parseFloat(e.target.value))}
          />
          <Input
            label="Interest"
            type="number"
            name="interest"
            placeholder="0.05"
            value={interest}
            onChange={(e) => setInterest(parseFloat(e.target.value))}
          />
          <Input
            label="Amortization Period (in months)"
            type="number"
            name="amortization-period"
            placeholder="360"
            value={amortizationPeriod}
            onChange={(e) => setAmortizationPeriod(parseFloat(e.target.value))}
          />
          <Input
            label="Mortgage Term/ Remaining in Term (in months)"
            type="number"
            name="mortgage-term"
            placeholder="60"
            value={mortgageTerm}
            onChange={(e) => setMortgageTerm(parseFloat(e.target.value))}
          />
          <Select
            label="Payment Frequency"
            name="payment-frequency"
            value={{
              value: `${paymentFrequency}`,
              label: options[paymentFrequency],
            }}
            options={Object.keys(options).map((key) => ({
              value: key,
              label: options[key as keyof ObjectMap],
            }))}
            onChange={(e) => {
              setPaymentFrequency(
                parseFloat((e as { label: string; value: string }).value)
              );
            }}
          />
          <Input
            label="Start Date"
            type="date"
            name="start-date"
            value={startDate.toISOString().split("T")[0]}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
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
                  <td className="border px-4 py-2">
                    {currencyFormatter.format(row.payment)}
                  </td>
                  <td className="border px-4 py-2">
                    {currencyFormatter.format(row.principal)}
                  </td>
                  <td className="border px-4 py-2">
                    {currencyFormatter.format(row.interest)}
                  </td>
                  <td className="border px-4 py-2">
                    {currencyFormatter.format(row.balance)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mb-8">
          <div className="flex flex-col">
            <Input
              label="Total Interest"
              type="text"
              name="total-interest"
              value={amortization
                .reduce((acc, row) => acc + row.interest, 0)
                ?.toLocaleString("en-CA", {
                  currency: "CAD",
                  style: "currency",
                })}
              readOnly
              disabled
              onChange={() => {}}
            />
          </div>
          <div className="flex flex-col">
            <Input
              label="Total Interest Paid In Term"
              type="text"
              name="total-interest-in-term"
              value={amortization[
                mortgageTerm - 1
              ]?.totalInterest?.toLocaleString("en-CA", {
                currency: "CAD",
                style: "currency",
              })}
              readOnly
              disabled
              onChange={() => {}}
            />
          </div>
          <div className="flex flex-col">
            <Input
              label="Total Principal"
              type="text"
              name="total-principal"
              value={amortization
                .reduce((acc, row) => acc + row.principal, 0)
                ?.toLocaleString("en-CA", {
                  currency: "CAD",
                  style: "currency",
                })}
              readOnly
              disabled
              onChange={() => {}}
            />
          </div>
          <div className="flex flex-col">
            <Input
              label="Total Payments"
              type="text"
              name="total-payments"
              value={amortization
                .reduce((acc, row) => acc + row.payment, 0)
                ?.toLocaleString("en-CA", {
                  currency: "CAD",
                  style: "currency",
                })}
              readOnly
              disabled
              onChange={() => {}}
            />
          </div>
          {/* Calculated payment per month based on Total Payments */}
          <div className="flex flex-col">
            <Input
              label="Payment Averaged Per Month"
              type="text"
              name="payment"
              placeholder="1000"
              value={(
                (amortization[0]?.payment * paymentFrequency) /
                12
              )?.toLocaleString("en-CA", {
                currency: "CAD",
                style: "currency",
              })}
              readOnly
              disabled
              onChange={() => {}}
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
