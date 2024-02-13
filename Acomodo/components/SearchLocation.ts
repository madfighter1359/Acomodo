import axios from "axios";
import { BASE_URL } from "../constants/URL";

interface Props {
  checkIn: number;
  checkOut: number;
  people: number;
  locId: string;
}

export default async function SearchLocation({
  checkIn,
  checkOut,
  people,
  locId,
}: Props) {
  // Change dates to MySQL format
  const checkInFormatted = new Date(checkIn).toISOString().split("T")[0];
  const checkOutFormatted = new Date(checkOut).toISOString().split("T")[0];

  // Attempt to retrieve results for query from database by calling API
  try {
    const response = await axios.get(`${BASE_URL}/search/details`, {
      params: {
        checkInDate: checkInFormatted,
        checkOutDate: checkOutFormatted,
        numberOfPeople: people,
        locationId: locId,
      },
    });
    // console.log(response.data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
}
