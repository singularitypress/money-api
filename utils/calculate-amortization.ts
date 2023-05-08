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
 * @returns Array of amortization table rows
 */
export const calculateAmortizationTable = (
  principal: number,
  interestRate: number,
  loanTerm: number
): AmortizationTableRow[] => {
  const monthlyInterestRate = interestRate / 12;
  const totalNumberOfPayments = loanTerm * 12;

  const payment =
    (principal *
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, totalNumberOfPayments))) /
    (Math.pow(1 + monthlyInterestRate, totalNumberOfPayments) - 1);

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
  }

  return amortizationTable;
};
