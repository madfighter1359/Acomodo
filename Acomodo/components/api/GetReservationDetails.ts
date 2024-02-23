import axios from "axios";
import { BASE_URL } from "../../constants/URL";

interface Props {
  token: string;
  reservationId: number;
}

export default async function GetDetails({ token, reservationId }: Props) {
  // Attempt to add reservation to DB by POSTing to API
  try {
    const response = await axios({
      method: "GET",
      baseURL: BASE_URL,
      url: `/guest/bookings/${reservationId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response?.data.message) {
        switch (e.response.data.message) {
          default:
            return false;
        }
      } else {
        console.log(e.response?.status);
        return false;
      }
    }
    console.log(e);
    return false;
  }
}
