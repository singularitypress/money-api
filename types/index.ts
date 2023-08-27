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

export interface AmortizationTableRow {
  paymentNumber: number;
  paymentDate: Date;
  balance: number;
  principal: number;
  interest: number;
  payment: number;
  totalInterest: number;
}

export interface CPIObservation {
  d: string;
  STATIC_TOTALCPICHANGE: {
    v: string;
  };
  CPI_MEDIAN: {
    v: string;
  };
  CPI_TRIM: {
    v: string;
  };
  STATIC_CPIXFET: {
    v: string;
  };
  CPI_COMMON: {
    v: string;
  };
  CPIW: {
    v: string;
  };
  V41690973: {
    v: string;
  };
  V41690914: {
    v: string;
  };
}

export interface CPIResponse {
  groupDetail: {
    label: string;
    description: string;
    link: string;
  };
  terms: {
    url: string;
  };
  seriesDetail: {
    [key: string]: {
      label: string;
      description: string;
      dimension: {
        key: string;
        name: string;
      };
    };
  };
  observations: CPIObservation[];
}
