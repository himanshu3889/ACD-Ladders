import {useState} from "react";

type DebounceFunction = (func: () => void, wait?: number) => void;

const useDebounce = (): DebounceFunction => {
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  function debounce(func: () => void, wait: number = 1000) {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const timeout = setTimeout(() => func(), wait);
    setTypingTimeout(timeout);
  }

  return debounce;
};

export default useDebounce;
