export class FenwickTree {
  n: number;
  fenwickTree: number[];

  constructor(n: number) {
    this.n = n + 10; // len of fenwick tree
    this.fenwickTree = new Array(this.n).fill(0); // 1 indexed
  }

  query(i: number): number {
    // sum of numbers from 1 to i(include)
    let total = 0;
    while (i > 0) {
      total += this.fenwickTree[i];
      i -= i & -i; // i & -i => extract last set fenwickTree
    }
    return total;
  }

  update(i: number, amount: number): void {
    // amount = newVal - prevVal
    while (i < this.n) {
      // i < len of fenwick tree
      this.fenwickTree[i] += amount;
      i += i & -i;
    }
  }
}
