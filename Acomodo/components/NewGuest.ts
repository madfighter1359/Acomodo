import axios from "axios";

interface Props {
  token: string;
  guestName: string;
  guestDoB: number;
  guestDocNr: string;
}

export default async function NewGuest({
  token,
  guestName,
  guestDoB,
  guestDocNr,
}: Props) {
  // Change dates to MySQL format
  const formattedDoB = new Date(guestDoB).toISOString().split("T")[0];

  // Attempt to retrieve results for query from database by calling API
  try {
    const response = await axios({
      method: "POST",
      url: "http://192.168.0.18/backend/acomodo/signup",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      data: {
        guestName: guestName,
        guestDoB: formattedDoB,
        guestDocNr: guestDocNr,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.log(e.response?.data);
    }
    console.log(e);
  }
}