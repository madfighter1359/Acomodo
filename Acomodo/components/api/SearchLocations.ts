import axios from "axios";
import { BASE_URL } from "../../constants/URL";

interface Props {
  checkIn: number;
  checkOut: number;
  people: number;
}

export default async function SearchForRoom({
  checkIn,
  checkOut,
  people,
}: Props) {
  // Change dates to MySQL format
  const checkInFormatted = new Date(checkIn).toISOString().split("T")[0];
  const checkOutFormatted = new Date(checkOut).toISOString().split("T")[0];

  // Attempt to retrieve results for query from database by calling API
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        checkInDate: checkInFormatted,
        checkOutDate: checkOutFormatted,
        numberOfPeople: people,
      },
    });
    return [response.status, response.data];
  } catch (e) {
    if (axios.isAxiosError(e)) {
      console.log(e);
      return [e.response?.status, null];
    }
    console.log(e);
    return [false, null];
  }
}
