export const bisectLeft = (arr: number[], target: number) => {
  let l = -1;
  let r = arr.length;

  while (l + 1 < r) {
    const mid = Math.floor((l + r) / 2);
    if (arr[mid] >= target) {
      r = mid;
    } else {
      l = mid;
    }
  }
  return r;
};
