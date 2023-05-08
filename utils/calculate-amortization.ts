interface AmortizationTableRow {
  paymentNumber: number;
  balance: number;
  principal: number;
  interest: number;
  payment: number;
}

/**
 * Calculate the amortization table for a mortgage
 *
 * @param principal Loan amount
 * @param interestRate Annual interest rate as a decimal
 * @param loanTerm Loan term in years
 * @param paymentFrequency Number of payments per year (12 for monthly, 26 for biweekly)
 * @returns Array of amortization table rows
 */
export const calculateAmortizationTable = (
  principal: number,
  interestRate: number,
  loanTerm: number,
  paymentFrequency: number
): AmortizationTableRow[] => {
  const totalNumberOfPayments = loanTerm * paymentFrequency;
  const monthlyInterestRate = interestRate / paymentFrequency;
  let payment = calculatePayment(
    principal,
    monthlyInterestRate,
    totalNumberOfPayments
  );

  let balance = principal;
  const amortizationTable: AmortizationTableRow[] = [];

  for (
    let paymentNumber = 1;
    paymentNumber <= totalNumberOfPayments;
    paymentNumber++
  ) {
    const interest = balance * monthlyInterestRate;
    const principal = payment - interest;
    balance -= principal;

    const row: AmortizationTableRow = {
      paymentNumber,
      balance,
      principal,
      interest,
      payment,
    };
    amortizationTable.push(row);

    if (paymentNumber % (paymentFrequency / 12) === 0) {
      // If we've completed a year's worth of payments, update the balance and reset the payment
      balance -= payment - principal;
      payment = calculatePayment(
        balance,
        monthlyInterestRate,
        totalNumberOfPayments - paymentNumber
      );
    }
  }

  return amortizationTable;
};

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
