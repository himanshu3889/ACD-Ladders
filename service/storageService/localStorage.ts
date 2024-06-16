export const setLocalStorage = (key: string, value: any) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

export const getLocalStorage = (key: string) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  } catch (error) {
    console.error(`Error getting localStorage key "${key}":`, error);
    return null;
  }
};

export const removeLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error);
  }
};

export const clearLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error(`Error clearing localStorage:`, error);
  }
};
