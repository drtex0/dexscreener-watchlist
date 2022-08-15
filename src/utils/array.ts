export const chunk = <T>(arr: T[], size: number): T[][] =>
  arr.reduce(
    (acc, e, i) => (i % size ? acc[acc.length - 1].push(e) : acc.push([e]), acc),
    [] as T[][],
  );
