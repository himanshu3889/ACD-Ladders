export const setCookie = (
  key: string,
  value: any,
  expirationDays: number = 1,
  expirationHours: number = 0,
  expirationMinutes: number = 0
) => {
  try {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expirationDays);
    expirationDate.setHours(expirationDate.getHours() + expirationHours);
    expirationDate.setMinutes(expirationDate.getMinutes() + expirationMinutes);

    const serializedValue = JSON.stringify(value);
    document.cookie = `${key}=${encodeURIComponent(
      serializedValue
    )};expires=${expirationDate.toUTCString()};path=/`;
  } catch (error) {
    console.error(`Error setting cookie "${key}":`, error);
  }
};

export const getCookie = (key: string) => {
  try {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [cookieKey, cookieValue] = cookie.split("=")?.map((c) => c.trim());
      if (cookieKey === key) {
        return JSON.parse(decodeURIComponent(cookieValue));
      }
    }
    return null;
  } catch (error) {
    console.error(`Error getting cookie "${key}":`, error);
    return null;
  }
};

export const removeCookie = (key: string) => {
  try {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  } catch (error) {
    console.error(`Error removing cookie "${key}":`, error);
  }
};
