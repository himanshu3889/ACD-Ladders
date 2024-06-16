import {ACD_Ladders_ProblemsUrl} from "../configs/constants";

export const fetchACDLaddersProblemsApi = async () => {
  try {
    const response: any = await fetch(ACD_Ladders_ProblemsUrl);
    const responseData: any = await response.json();
    return responseData;
  } catch (error) {
    throw error;
  }
};
