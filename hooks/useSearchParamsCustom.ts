import {useEffect} from "react";
import {useRouter} from "next/router";

const useSearchParamsCustom = () => {
  const router = useRouter();

  const getSearchParamsRecord = () => {
    // Get the current URL
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    // Convert URLSearchParams to a plain object
    const paramsObject: {[key: string]: string} = {};
    for (const [key, value] of params.entries()) {
      paramsObject[key] = value;
    }
    return paramsObject;
  };

  // Retrieve a specific query parameter by name
  const getSearchParam = (paramName: string) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    return params.get(paramName) || "";
  };

  const updateSearchParams = (
    updates: Record<string, string | number | null | undefined>,
    replace: boolean = true
  ) => {
    // Get current query parameters from URL
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    // Apply updates to the query parameters
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value == null) {
        params.delete(key); // Remove the parameter if value is null or undefined
      } else {
        params.set(key, value.toString()); // Update or add the parameter
      }
    });

    // Update the URL with new query parameters
    router[replace ? "replace" : "push"](
      {
        pathname: router.pathname,
        query: params.toString(),
      },
      undefined,
      {shallow: true}
    );
  };

  return {
    getSearchParamsRecord,
    updateSearchParams,
    getSearchParam
  };
};

export default useSearchParamsCustom;
