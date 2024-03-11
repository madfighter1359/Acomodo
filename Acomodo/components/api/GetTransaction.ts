import axios from "axios";
import { BASE_URL } from "../../constants/URL";

interface Props {
  token: string;
  reservationId: number;
}

export default async function GetTransaction({ token, reservationId }: Props) {
  // Attempt to retrieve results for query from database by calling API
  try {
    const response = await axios({
      method: "GET",
      baseURL: BASE_URL,
      url: `/guest/bookings/${reservationId}/transaction`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {
    // Handle errors
    if (axios.isAxiosError(e)) {
      console.log(e.response?.data, e.response?.status);
      return false;
    }
    console.log(e);
    return false;
  }
}
