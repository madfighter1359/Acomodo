import axios from "axios";
import { BASE_URL } from "../../constants/URL";

interface Props {
  token: string;
  checkInDate: number;
  checkOutDate: number;
  numberOfPeople: number;
  price: number;
  locationId: string;
  roomType: string;
}

export default async function NewReservation({
  token,
  checkInDate,
  checkOutDate,
  numberOfPeople,
  price,
  locationId,
  roomType,
}: Props) {
  // Change dates to MySQL format
  const checkInFormatted = new Date(checkInDate).toISOString().split("T")[0];
  const checkOutFormatted = new Date(checkOutDate).toISOString().split("T")[0];

  // Attempt to add reservation to DB by POSTing to API
  try {
    const response = await axios({
      method: "POST",
      baseURL: BASE_URL,
      url: "/book",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
      data: {
        checkInDate: checkInFormatted,
        checkOutDate: checkOutFormatted,
        numberOfPeople: numberOfPeople,
        price: price,
        locationId: locationId,
        roomType: roomType,
      },
    });
    // console.log(response.data);
    if (response.data.status == "Success") {
      return [true, response.data.reservationId, response.data.details];
    }
    return [false, "An unkown error occured."];
  } catch (e) {
    if (axios.isAxiosError(e)) {
      if (e.response?.data.message) {
        switch (e.response.data.message) {
          case "No rooms available":
            return [
              false,
              "There was an error booking your room. It seems there are no longer any avaiable rooms which match your request.",
            ];
            break;
          case "Price mismatch":
            return [
              false,
              "There has been an error calculating the price of your room.",
            ];
            break;
          default:
            return [false, "An unkown error occured."];
        }
      } else {
        console.log(e.response?.status);
        return [false, "An unkown error occured."];
      }
    }
    return [false, "An unkown error occured."];
  }
}