import { Container } from "@components/ui";
import { AmortizationTableRow } from "@types";
import { calculateAmortizationTable } from "@utils";
import Head from "next/head";
import { useEffect, useState } from "react";

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
        </div>
        <details className="mb-8">
          <summary className="text-xl font-bold cursor-pointer">
            Bar Chart
          </summary>
        </details>
      </Container>
    </>
  );
}
