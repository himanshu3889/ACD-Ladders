import {FenwickTree} from "../../../dataStructures/fenwickTree";

export class UserRanking {
  totalUsers: number;
  userToPointMap: Map<string, number>;
  fenwickTree: FenwickTree;

  constructor(maxPoints: number) {
    this.totalUsers = 0;
    this.userToPointMap = new Map<string, number>();
    this.fenwickTree = new FenwickTree(maxPoints);
  }

  updatePoints(user: string, points: number): void {
    let prevPoints: number = 0;
    // if user already exists then update the fenwick tree at prev point of the user
    if (this.userToPointMap.has(user)) {
      prevPoints = this.userToPointMap.get(user) ?? 0; // never be 0
      this.fenwickTree.update(prevPoints, -1);
    } else {
      this.totalUsers++;
    }
    const newPoints: number = prevPoints + points;
    this.fenwickTree.update(newPoints, 1);
    this.userToPointMap.set(user, newPoints);
  }

  getRank(user: string): number | null {
    const userTotalPoints: number | null =
      this.userToPointMap.get(user) ?? null;
    if (userTotalPoints === null) {
      const rank: number = this.totalUsers + 1;
      return rank;
    }
    const usersLessThanEqualPoints: number =
      this.fenwickTree.query(userTotalPoints);
    const usersGreaterThanPoints = this.totalUsers - usersLessThanEqualPoints;
    const rank: number = usersGreaterThanPoints + 1;
    return rank;
  }
}
