export interface Pair {
  timestamp: any;
  platformId: string;
  dexId: string;
  pairAddress: string;
  baseTokenName: string;
  baseTokenSymbol: string;
  quoteTokenSymbol: string;
}

export interface List {
  updatedAtTimestamp: any;
  id: string;
  name: string;
  pairs: Pair[];
}

export interface RootObject {
  updatedAtTimestamp: number;
  lists: List[];
}
