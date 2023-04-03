export interface Transaction {
  date: string;
  desc: string;
  amt: number;
  institution: string;
  account: string;
  info: string;
  debit?: string;
  credit?: string;
}

// Interface based on the transactions resolver
export interface TransactionResolver {
  startDate?: string;
  endDate?: string;
  minAmt?: string;
  maxAmt?: string;
  institutions?: string[];
  accounts?: string[];
  info?: string;
  desc?: string[];
  excludeString?: string[];
}
