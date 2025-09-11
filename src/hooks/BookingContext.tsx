import { CartItem, FormDatas } from "@/components/MOWAAForm";
import React, { createContext, useContext, useState, ReactNode } from "react";

type BookingContextType = {
  formData: FormDatas;
  setFormData: React.Dispatch<React.SetStateAction<FormDatas>>;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormDatas>({
    personalInfo: { name: "", email: "", phone: "" },
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

  return (
    <BookingContext.Provider
      value={{ formData, setFormData, cartItems, setCartItems, error, setError }}
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
