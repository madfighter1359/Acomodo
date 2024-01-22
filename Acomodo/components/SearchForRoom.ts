import axios from "axios";

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
  const checkInFormatted = new Date(checkIn).toISOString().split("T")[0];
  const checkOutFormatted = new Date(checkOut).toISOString().split("T")[0];
  try {
    const response = await axios.get(
      "http://192.168.0.18/backend/reservationQuery.php",
      {
        params: {
          checkInDate: checkInFormatted,
          checkOutDate: checkOutFormatted,
          numberOfPeople: people,
        },
      }
    );
    console.log(response.data);
  } catch (e) {
    console.log(e);
  }
}
