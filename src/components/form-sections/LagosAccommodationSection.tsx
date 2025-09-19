import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface LagosAccommodationSectionProps {
  hotel: string;
  onUpdate: (data: { hotel: string }) => void;
}

const hotels = [
  "Federal Palace Hotel & Casino",
  "Radisson Blu Anchorage Hotel",
  "The George Hotel",
  "Eko Hotel",
];

export const LagosAccommodationSection: React.FC<
  LagosAccommodationSectionProps
> = ({ hotel, onUpdate }) => {
  const handleSelect = (selectedHotel: string) => {
    onUpdate({ hotel: selectedHotel });
  };

  return (
    <div className="space-y-6">
      <Label className="text-base font-medium mb-4 block">
        Lagos Accommodation
      </Label>
      <p className="text-sm text-muted-foreground mb-6">
        Please let us know your accommodation plan to enable our travel agency
        to plan your airport pickup and transfer to your hotel.
      </p>

      <div className="space-y-3">
        {hotels.map((h) => (
          <div key={h} className="flex items-center space-x-2">
            <Checkbox
              id={h}
              checked={hotel === h}
              onCheckedChange={() => handleSelect(h)}
            />
            <Label htmlFor={h} className="cursor-pointer">
              {h}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
