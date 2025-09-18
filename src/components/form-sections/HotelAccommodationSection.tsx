import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "../MOWAAForm";
import { useBooking } from "@/hooks/BookingContext";

interface HotelAccommodationSectionProps {
  hotelData: string;
  roomTypeData: string;
  onUpdate: (section: string, data: any) => void;
  onAddToCart: (item: CartItem) => void;
}

const hotels = [
  { id: "federal_palace", name: "Federal Palace Hotel & Casino" },
  { id: "radisson", name: "Radisson Blu Anchorage Hotel (V.I)" },
  { id: "eko", name: "Eko Hotels" },
];

const roomTypes = {
  federal_palace: [
    {
      id: "standard_city_single",
      name: "Standard Room City Facing (Single Occupancy)",
      price: 160000,
    },
    {
      id: "standard_city_double",
      name: "Standard Room City Facing (Double Occupancy)",
      price: 185000,
    },
    {
      id: "standard_sea_single",
      name: "Standard Room Sea View (Single Occupancy)",
      price: 175000,
    },
    {
      id: "standard_sea_double",
      name: "Standard Room Sea View (Double Occupancy)",
      price: 210000,
    },
    {
      id: "superior_city_single",
      name: "Superior Luxury Room City Facing (Single Occupancy)",
      price: 185000,
    },
    {
      id: "superior_sea_single",
      name: "Superior Luxury Room Sea View (Single Occupancy)",
      price: 200000,
    },
    {
      id: "superior_city_double",
      name: "Superior Luxury Room City Facing (Double Occupancy)",
      price: 210000,
    },
    {
      id: "superior_sea_double",
      name: "Superior Luxury Room Sea View (Double Occupancy)",
      price: 225000,
    },
  ],
  eko: [
    {
      id: "classic_superior",
      name: "Eko Classic Superior (B&B)",
      price: 220000,
    },
    {
      id: "atlantic_superior",
      name: "Eko Atlantic Superior (B&B)",
      price: 240000,
    },
  ],
};

export const HotelAccommodationSection: React.FC<
  HotelAccommodationSectionProps
> = ({ hotelData, roomTypeData, onUpdate, onAddToCart }) => {
  const [selectedHotel, setSelectedHotel] = useState(hotelData);
  const [selectedRoomType, setSelectedRoomType] = useState(roomTypeData);
  const { toast } = useToast();

  const { currency, convertPrice, formatCurrency } = useBooking();

  const handleHotelChange = (hotel: string) => {
    setSelectedHotel(hotel);
    setSelectedRoomType(""); // reset room type
    onUpdate("hotel", hotel);
  };

  const handleRoomTypeChange = (roomType: string) => {
    setSelectedRoomType(roomType);
    onUpdate("roomType", roomType);
  };

  const addRoomToCart = () => {
    if (!selectedHotel || !selectedRoomType) return;

    const hotel = hotels.find((h) => h.id === selectedHotel);
    const roomOptions =
      selectedHotel === "federal_palace"
        ? roomTypes.federal_palace
        : selectedHotel === "eko"
        ? roomTypes.eko
        : [];

    const room = roomOptions.find((r) => r.id === selectedRoomType);

    if (hotel && room) {
      const cartItem: CartItem = {
        id: `${selectedHotel}_${selectedRoomType}`,
        name: `${hotel.name} - ${room.name}`,
        price: room.price, // always NGN
        category: "Accommodation",
        details: `1 room, 1 night (default)`,
      };
      onAddToCart(cartItem);

      toast({
        title: "Accommodation Added to Cart",
        description: `${hotel.name} - ${room.name} has been added to your cart.`,
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Hotel Selection */}
      <div>
        <Label className="text-base font-medium mb-4 block">
          Hotels & Accommodation (Please choose your preferred hotel choice) *
        </Label>
        <RadioGroup value={selectedHotel} onValueChange={handleHotelChange}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotels.map((hotel) => (
              <Card
                key={hotel.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={hotel.id} id={hotel.id} />
                    <Label
                      htmlFor={hotel.id}
                      className="font-medium cursor-pointer"
                    >
                      {hotel.name}
                    </Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Room Type Selection */}
      {selectedHotel &&
        (selectedHotel === "federal_palace" || selectedHotel === "eko") && (
          <div>
            <Label className="text-base font-medium mb-4 block">
              Please choose your preferred room type *
            </Label>
            <RadioGroup
              value={selectedRoomType}
              onValueChange={handleRoomTypeChange}
            >
              <div className="space-y-3">
                {(selectedHotel === "federal_palace"
                  ? roomTypes.federal_palace
                  : roomTypes.eko
                ).map((room) => (
                  <Card
                    key={room.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem
                            value={room.id}
                            id={room.id}
                            className="mt-1"
                          />
                          <div>
                            <Label
                              htmlFor={room.id}
                              className="font-medium cursor-pointer"
                            >
                              {room.name}
                            </Label>
                            <Badge variant="secondary" className="ml-2">
                              {formatCurrency(
                                convertPrice(room.price, currency),
                                currency
                              )}{" "}
                              per night
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}

      {/* Add to Cart Button */}
      {selectedHotel && selectedRoomType && (
        <div className="flex justify-center">
          <Button
            onClick={addRoomToCart}
            className="bg-gradient-primary hover:opacity-90"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Accommodation to Cart
          </Button>
        </div>
      )}
    </div>
  );
};
