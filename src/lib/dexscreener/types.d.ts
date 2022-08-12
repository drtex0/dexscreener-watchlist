interface Pair {
  timestamp: number;
  platformId: string;
  dexId: string;
  pairAddress: string;
  baseTokenName: string;
  baseTokenSymbol: string;
  quoteTokenSymbol: string;
}

interface List {
  updatedAtTimestamp: number;
  id: string;
  name: string;
  pairs: Pair[];
}

interface WatchList {
  updatedAtTimestamp: number;
  lists: List[];
}
