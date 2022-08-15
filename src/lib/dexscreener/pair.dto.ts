import { z } from 'zod';

export const baseTokenSchema = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
});

export const quoteTokenSchema = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
});

export const transactionsSchema = z.object({
  buys: z.number(),
  sells: z.number(),
});

export const txnsSchema = z.object({
  h24: transactionsSchema,
  h6: transactionsSchema,
  h1: transactionsSchema,
  m5: transactionsSchema,
});

export const volumeSchema = z.object({
  h24: z.number().optional(),
  h6: z.number().optional(),
  h1: z.number().optional(),
  m5: z.number().optional(),
});

export const priceChangeSchema = z.object({
  h24: z.number(),
  h6: z.number(),
  h1: z.number(),
  m5: z.number(),
});

export const liquiditySchema = z.object({
  usd: z.number(),
  base: z.number(),
  quote: z.number(),
});

export const pairSchema = z.object({
  chainId: z.string(),
  dexId: z.string(),
  url: z.string(),
  pairAddress: z.string(),
  baseToken: baseTokenSchema,
  quoteToken: quoteTokenSchema,
  priceNative: z.string(),
  priceUsd: z.string(),
  txns: txnsSchema,
  volume: volumeSchema.optional(),
  priceChange: priceChangeSchema,
  liquidity: liquiditySchema,
  fdv: z.number(),
  pairCreatedAt: z.number().optional(),
});

export const rootObjectSchema = z.object({
  schemaVersion: z.string(),
  pairs: z.array(pairSchema),
  pair: z.null(),
});

export type PairDto = z.infer<typeof pairSchema>;
export type RootPairDto = z.infer<typeof rootObjectSchema>;
