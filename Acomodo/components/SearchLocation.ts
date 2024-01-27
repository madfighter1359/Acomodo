import axios from "axios";

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
    const response = await axios.get(
      // "http://192.168.0.18/backend/locationQuery.php",
      "http://82.25.148.82:81/Backend/locationQuery.php",
      {
        params: {
          checkInDate: checkInFormatted,
          checkOutDate: checkOutFormatted,
          numberOfPeople: people,
          locationId: locId,
        },
      }
    );
    // console.log(response.data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
}
