import { chunk } from './array';

describe('#chunk', () => {
  it.each([
    { arr: [], chunkSize: 1, expected: [] },
    { arr: [1], chunkSize: 0, expected: [[1]] },
    { arr: [1], chunkSize: 1, expected: [[1]] },
    { arr: [1], chunkSize: 2, expected: [[1]] },
    { arr: [1, 2], chunkSize: 1, expected: [[1], [2]] },
    { arr: [1, 2, 3], chunkSize: 2, expected: [[1, 2], [3]] },
  ])('chunks the array ', ({ arr, chunkSize, expected }) => {
    expect(chunk(arr, chunkSize)).toEqual(expected);
  });
});
