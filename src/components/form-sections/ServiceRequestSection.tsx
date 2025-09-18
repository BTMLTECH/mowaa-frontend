import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "../MOWAAForm";
import { useBooking } from "@/hooks/BookingContext";

interface ServiceRequestSectionProps {
  data: string[];
  onUpdate: (data: string[]) => void;
  onAddToCart: (item: CartItem) => void;
}

const services = [
  { id: "evisa", name: "E-visa (Cost is based on nationality)", price: 0 },
  {
    id: "vip_protocol",
    name: "VIP airport protocol (VIP meet & greet, airport concierge services)",
    price: 110000,
  },
  // { id: 'pickup_sedan', name: 'Airport pickup and drop off on arrival with a SEDAN', price: 118400 },
  {
    id: "pickup_suv",
    name: "Airport pickup and drop off on arrival with an SUV",
    price: 193600,
  },
  {
    id: "flight_tickets",
    name: "Flight tickets (Lagos - Benin - Lagos)",
    price: 0,
  },
  // { id: 'charter_sedan', name: '1-day vehicle charter with a driver (SEDAN)', price: 145200 },
  // { id: 'charter_suv', name: '1-day vehicle charter with a driver (SUV)', price: 204300 }
];

export const ServiceRequestSection: React.FC<ServiceRequestSectionProps> = ({
  data,
  onUpdate,
  onAddToCart,
}) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    Array.isArray(data) ? data : []
  );
  const { toast } = useToast();

  const { currency, convertPrice, formatCurrency } = useBooking();

  const handleServiceToggle = (serviceId: string) => {
    const newServices = selectedServices.includes(serviceId)
      ? selectedServices.filter((id) => id !== serviceId)
      : [...selectedServices, serviceId];

    setSelectedServices(newServices);
    onUpdate(newServices);
  };

  const addServiceToCart = (service: (typeof services)[0]) => {
    const cartItem: CartItem = {
      id: service.id,
      name: service.name,
      price: service.price,
      category: "Service",
    };
    onAddToCart(cartItem);

    toast({
      title: "Item Added to Cart",
      description: `${service.name} has been added to your cart.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium mb-4 block">
          Please choose your preferred service(s) *
        </Label>
        <p className="text-sm text-muted-foreground mb-6">
          This includes but not limited to all relevant services to ensure a
          smooth stay.
        </p>

        <div className="space-y-4">
          {services.map((service) => (
            <Card
              key={service.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id={service.id}
                    checked={selectedServices.includes(service.id)}
                    onCheckedChange={() => handleServiceToggle(service.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={service.id}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {service.name}
                    </Label>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {service.price === 0
                          ? "Price varies"
                          : formatCurrency(
                              convertPrice(service.price, currency),
                              currency
                            )}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addServiceToCart(service)}
                        className="text-xs"
                        disabled={!selectedServices.includes(service.id)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
