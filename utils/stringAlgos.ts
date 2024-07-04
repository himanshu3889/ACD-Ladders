const titleExceptions = [
  "a",
  "an",
  "and",
  "at",
  "but",
  "by",
  "for",
  "in",
  "is",
  "nor",
  "of",
  "on",
  "or",
  "so",
  "the",
  "to",
  "up",
  "yet",
];

export const titleCase = (sentence: string, withException: boolean = true) => {
  return sentence
    .split(" ")
    .map((word: string, index: number) => {
      if (word) {
        const wordLowerCase = word.toLowerCase();
        if (
          index > 0 &&
          withException &&
          titleExceptions.includes(wordLowerCase)
        ) {
          return wordLowerCase;
        }
        return word.charAt(0).toUpperCase() + word.substring(1);
      }
    })
    .join(" ");
};

export const mixedSort = (a: string, b: string) => {
  const numA = Number(a);
  const numB = Number(b);

  // Check if both values are valid numbers
  if (!isNaN(numA) && !isNaN(numB)) {
    return numA - numB;
  }

  // Fallback to lexicographic comparison if either value is not a number
  return a.localeCompare(b);
};
