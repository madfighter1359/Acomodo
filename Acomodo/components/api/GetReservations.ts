import axios from "axios";
import { BASE_URL } from "../../constants/URL";

interface Props {
  token: string;
}

export default async function GetReservations({ token }: Props) {
  console.log(token);
  // Attempt to retrieve results for query from database by calling API
  try {
    const response = await axios({
      method: "GET",
      baseURL: BASE_URL,
      url: "/guest/bookings",
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
