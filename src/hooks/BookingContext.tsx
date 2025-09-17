import { CartItem, FormDatas } from "@/components/MOWAAForm";
import { api } from "@/lib/api";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Currency = "NGN" | "USD";

type BookingContextType = {
  formData: FormDatas;
  setFormData: React.Dispatch<React.SetStateAction<FormDatas>>;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  exchangeRate: number | null;
  currency: Currency;
  setCurrency: React.Dispatch<React.SetStateAction<Currency>>;
  convertPrice: (price: number, currency: Currency) => number;
  formatCurrency: (amount: number, currency: Currency) => string;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormDatas>({
    personalInfo: { name: "", email: "", phone: "" },
    entryIntoNigeria: {
      travelDocument: "",
      otherDocumentDetails: "",
      passportScan: null,
      passportPhoto: null,
      flightProof: null,
      signedLetter: null,
    },
    travelInfo: {
      arrivalDate: "",
      airline: "",
      flightNumber: "",
      departureTime: "",
      arrivalTime: "",
      departureDate: "",
      departureTimeFromLagos: "",
    },
    services: [],
    hotel: "",
    roomType: "",
    numberOfNights: "",
    numberOfRooms: "",
    stayInBenin: "",
    beninDuration: "",
    comments: "",
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<Currency>("NGN");
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    api
      .getExchangeRate()
      .then((data) => {
        if (data?.rate) {
          setExchangeRate(data.rate);
        } else {
          setError("Failed to load exchange rate. Using fallback.");
          setExchangeRate(1550);
        }
      })
      .catch((err) => {
        setError("Could not fetch exchange rate. Using fallback.");
        setExchangeRate(1550);
      });
  }, []);

  // ✅ Convert price
  const convertPrice = (price: number, targetCurrency: Currency) => {
    if (targetCurrency === "USD" && exchangeRate) {
      return parseFloat((price / exchangeRate).toFixed(2));
    }
    return price;
  };

  const formatCurrency = (amount: number, targetCurrency: Currency) => {
    if (targetCurrency === "NGN") return `₦${amount.toLocaleString()}`;
    return `$${amount.toFixed(2)}`;
  };

  return (
    <BookingContext.Provider
      value={{
        formData,
        setFormData,
        cartItems,
        setCartItems,
        error,
        setError,
        currency,
        setCurrency,
        exchangeRate,
        convertPrice,
        formatCurrency,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used inside BookingProvider");
  }
  return context;
};
