import axios from 'axios';
import { ACD_Ladders_ProblemsUrl } from '../configs/constants';

export const fetchACDLaddersProblemsApi = async () => {
  try {
    const response = await axios.get(ACD_Ladders_ProblemsUrl);
    return response.data;
  } catch (error) {
    throw error;
  }
};
