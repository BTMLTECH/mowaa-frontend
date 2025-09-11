import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CartItem } from '../MOWAAForm';

interface HotelAccommodationSectionProps {
  hotelData: string;
  roomTypeData: string;
  nightsData: string;
  roomsData: string;
  onUpdate: (section: string, data: any) => void;
  onAddToCart: (item: CartItem) => void;
}

const hotels = [
  { id: 'george', name: 'The George Hotel' },
  { id: 'federal_palace', name: 'Federal Palace Hotel & Casino' },
  { id: 'radisson', name: 'Radisson Blu Anchorage Hotel (V.I)' },
  { id: 'eko', name: 'Eko Hotels' }
];

const roomTypes = {
  federal_palace: [
    { id: 'standard_city_single', name: 'Standard Room City Facing (Single Occupancy)', price: 160000 },
    { id: 'standard_city_double', name: 'Standard Room City Facing (Double Occupancy)', price: 185000 },
    { id: 'standard_sea_single', name: 'Standard Room Sea View (Single Occupancy)', price: 175000 },
    { id: 'standard_sea_double', name: 'Standard Room Sea View (Double Occupancy)', price: 210000 },
    { id: 'superior_city_single', name: 'Superior Luxury Room City Facing (Single Occupancy)', price: 185000 },
    { id: 'superior_sea_single', name: 'Superior Luxury Room Sea View (Single Occupancy)', price: 200000 },
    { id: 'superior_city_double', name: 'Superior Luxury Room City Facing (Double Occupancy)', price: 210000 },
    { id: 'superior_sea_double', name: 'Superior Luxury Room Sea View (Double Occupancy)', price: 225000 }
  ],
  eko: [
    { id: 'classic_superior', name: 'Eko Classic Superior (B&B)', price: 220000 },
    { id: 'atlantic_superior', name: 'Eko Atlantic Superior (B&B)', price: 240000 }
  ]
};

const nightOptions = ['1', '2', '3', '4', '5'];
const roomOptions = ['1', '2', '3', '4', '5'];

export const HotelAccommodationSection: React.FC<HotelAccommodationSectionProps> = ({
  hotelData,
  roomTypeData,
  nightsData,
  roomsData,
  onUpdate,
  onAddToCart
}) => {
  const [selectedHotel, setSelectedHotel] = useState(hotelData);
  const [selectedRoomType, setSelectedRoomType] = useState(roomTypeData);
  const [selectedNights, setSelectedNights] = useState(nightsData);
  const [selectedRooms, setSelectedRooms] = useState(roomsData);
  const { toast } = useToast();

  const handleHotelChange = (hotel: string) => {
    setSelectedHotel(hotel);
    setSelectedRoomType(''); // Reset room type when hotel changes
    onUpdate('hotel', hotel);
  };

  const handleRoomTypeChange = (roomType: string) => {
    setSelectedRoomType(roomType);
    onUpdate('roomType', roomType);
  };

  const handleNightsChange = (nights: string) => {
    setSelectedNights(nights);
    onUpdate('numberOfNights', nights);
  };

  const handleRoomsChange = (rooms: string) => {
    setSelectedRooms(rooms);
    onUpdate('numberOfRooms', rooms);
  };

  const addRoomToCart = () => {
    if (!selectedHotel || !selectedRoomType || !selectedNights || !selectedRooms) {
      return;
    }

    const hotel = hotels.find(h => h.id === selectedHotel);
    const roomOptions = selectedHotel === 'federal_palace' 
      ? roomTypes.federal_palace 
      : selectedHotel === 'eko' 
      ? roomTypes.eko 
      : [];
    
    const room = roomOptions.find(r => r.id === selectedRoomType);
    
    if (hotel && room) {
      const totalPrice = room.price * parseInt(selectedNights) * parseInt(selectedRooms);
      const cartItem: CartItem = {
        id: `${selectedHotel}_${selectedRoomType}_${selectedNights}_${selectedRooms}`,
        name: `${hotel.name} - ${room.name}`,
        price: totalPrice,
        category: 'Accommodation',
        details: `${selectedNights} night(s), ${selectedRooms} room(s)`
      };
      onAddToCart(cartItem);
      
      toast({
        title: "Accommodation Added to Cart",
        description: `${hotel.name} - ${room.name} for ${selectedNights} night(s), ${selectedRooms} room(s) has been added to your cart.`,
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
              <Card key={hotel.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={hotel.id} id={hotel.id} />
                    <Label htmlFor={hotel.id} className="font-medium cursor-pointer">
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
      {selectedHotel && (selectedHotel === 'federal_palace' || selectedHotel === 'eko') && (
        <div>
          <Label className="text-base font-medium mb-4 block">
            Please choose your preferred room type *
          </Label>
          <RadioGroup value={selectedRoomType} onValueChange={handleRoomTypeChange}>
            <div className="space-y-3">
              {(selectedHotel === 'federal_palace' ? roomTypes.federal_palace : roomTypes.eko).map((room) => (
                <Card key={room.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value={room.id} id={room.id} className="mt-1" />
                        <div>
                          <Label htmlFor={room.id} className="font-medium cursor-pointer">
                            {room.name}
                          </Label>
                          <Badge variant="secondary" className="ml-2">
                            ₦{room.price.toLocaleString()} per night
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

      {/* Duration and Rooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-base font-medium mb-3 block">
            Number of Nights *
          </Label>
          <Select value={selectedNights} onValueChange={handleNightsChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select nights" />
            </SelectTrigger>
            <SelectContent>
              {nightOptions.map((night) => (
                <SelectItem key={night} value={night}>
                  {night} night{night !== '1' ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">
            Number of Rooms *
          </Label>
          <Select value={selectedRooms} onValueChange={handleRoomsChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select rooms" />
            </SelectTrigger>
            <SelectContent>
              {roomOptions.map((room) => (
                <SelectItem key={room} value={room}>
                  {room} room{room !== '1' ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Add to Cart Button */}
      {selectedHotel && selectedRoomType && selectedNights && selectedRooms && (
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