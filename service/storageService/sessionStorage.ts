export const setSessionStorage = (key: string, value: any) => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error setting sessionStorage key "${key}":`, error);
  }
};

export const getSessionStorage = (key: string) => {
  try {
    const storedValue = sessionStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  } catch (error) {
    console.error(`Error getting sessionStorage key "${key}":`, error);
    return null;
  }
};

export const removeSessionStorage = (key: string) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing sessionStorage key "${key}":`, error);
  }
};

export const clearSessionStorage = () => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error(`Error clearing sessionStorage:`, error);
  }
};
