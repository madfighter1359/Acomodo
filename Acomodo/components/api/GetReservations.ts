import axios from "axios";
import { BASE_URL } from "../../constants/URL";

interface Props {
  token: string;
}

export default async function GetReservations({ token }: Props) {
  // Attempt to add reservation to DB by POSTing to API
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
    return false;
  }
}
