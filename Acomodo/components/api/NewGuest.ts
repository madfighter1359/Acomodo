import axios from "axios";
import { BASE_URL } from "../../constants/URL";

interface Props {
  token: string;
  guestName: string;
  guestDoB: number;
  guestDocNr: string;
  email: string;
}

// Parameters for function
export default async function NewGuest({
  token,
  guestName,
  guestDoB,
  guestDocNr,
  email,
}: Props) {
  // Change dates to MySQL format
  const formattedDoB = new Date(guestDoB).toISOString().split("T")[0];

  // Attempt to add new guest to database by POSTing to API
  try {
    const response = await axios({
      method: "POST",
      baseURL: BASE_URL,
      url: "signup",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      data: {
        guestName: guestName,
        guestDoB: formattedDoB,
        guestDocNr: guestDocNr,
        email: email,
      },
    });
    console.log(response.data);
    return response.status;
  } catch (e) {
    // Handle errors
    if (axios.isAxiosError(e)) {
      console.log(e.response?.data);
      return e.response?.status;
    }
    return false;
  }
}
