import { AmortizationTableRow } from "@types";

/**
 * Calculates the amortization table for a mortgage with the given parameters.
 *
 * @param principal The initial loan amount.
 * @param interestRate The annual interest rate as a decimal.
 * @param loanTerm The length of the loan in months.
 * @param paymentFrequency The number of payments per year.
 * @param startDate The start date for the first payment.
 *
 * @returns An array of objects representing the amortization table for the loan.
 */
export function calculateAmortizationTable(
  principal: number,
  interestRate: number,
  loanTerm: number,
  paymentFrequency: number,
  startDate: Date = new Date()
): AmortizationTableRow[] {
  const amortizationTable: AmortizationTableRow[] = [];

  let balance = principal;
  const monthlyInterestRate = interestRate / paymentFrequency;

  const totalPayments = (loanTerm / 12) * paymentFrequency;

  let paymentNumber = 0;
  let paymentDate = startDate;
  while (balance > 0 && paymentNumber < totalPayments) {
    // Increment the payment number and calculate the payment date.
    paymentNumber++;
    paymentDate = addPaymentInterval(paymentDate, paymentFrequency);

    // Calculate the payment amount for this period.
    const payment = calculatePayment(
      balance,
      monthlyInterestRate,
      totalPayments - paymentNumber + 1
    );

    // Calculate the interest and principal components of the payment.
    const interest = balance * monthlyInterestRate;
    const principal = payment - interest;

    // Update the loan balance after the payment is made.
    balance -= principal;

    // Add a new row to the amortization table for this period.
    amortizationTable.push({
      paymentNumber,
      paymentDate,
      balance,
      principal,
      interest,
      payment,
    });
  }

  return amortizationTable;
}

/**
 * Adds the specified number of months to the given date.
 *
 * @param date The initial date to add months to.
 * @param months The number of months to add.
 *
 * @returns A new Date object representing the date after the specified number of months.
 */
function addMonths(date: Date, months: number): Date {
  const newDate = new Date(date);
  newDate.setMonth(date.getMonth() + months);
  return newDate;
}

/**
 * Adds the specified number of weeks to the given date.
 *
 * @param date The initial date to add weeks to.
 * @param weeks The number of weeks to add.
 *
 * @returns A new Date object representing the date after the specified number of weeks.
 */
function addWeeks(date: Date, weeks: number): Date {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + weeks * 7);
  return newDate;
}

/**
 * Adds the specified payment interval to the given date.
 *
 * @param date The initial date to add the payment interval to.
 * @param paymentFrequency The number of payments per year.
 *
 * @returns A new Date object representing the date after the specified payment interval.
 */
function addPaymentInterval(date: Date, paymentFrequency: number): Date {
  switch (paymentFrequency) {
    case 12:
      // Monthly payments: add 1 month to the date.
      return addMonths(date, 1);
    case 24:
      // Bi-weekly payments: add 2 weeks to the date.
      return addWeeks(date, 2);
    case 26:
      // Bi-weekly accelerated payments: add 2 weeks to the date.
      return addWeeks(date, 2);
    case 52:
      // Weekly payments: add 1 week to the date.
      return addWeeks(date, 1);
    default:
      // If the payment frequency is not recognized, throw an error.
      throw new Error(`Unsupported payment frequency: ${paymentFrequency}`);
  }
}

/**
 * Calculate the payment amount for a mortgage
 *
 * @param principal Loan amount
 * @param monthlyInterestRate Monthly interest rate as a decimal
 * @param totalNumberOfPayments Total number of payments
 * @returns Payment amount
 */
export const calculatePayment = (
  principal: number,
  monthlyInterestRate: number,
  totalNumberOfPayments: number
): number => {
  return (
    (principal *
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, totalNumberOfPayments))) /
    (Math.pow(1 + monthlyInterestRate, totalNumberOfPayments) - 1)
  );
};
