// src/components/ServiceRequestSection.tsx
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
  exchangeRate?: number | null;
  applicantCountry?: string;
}

type Option = {
  id: string;
  name: string;
  price: number;
};

type Service = {
  id: string;
  name: string;
  price?: number;
  options?: Option[];
};

export const ServiceRequestSection: React.FC<ServiceRequestSectionProps> = ({
  data,
  onUpdate,
  onAddToCart,
  exchangeRate: propExchangeRate = null,
  applicantCountry,
}) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    Array.isArray(data) ? data : []
  );
  const { toast } = useToast();
  const {
    currency,
    convertPrice,
    formatCurrency,
    exchangeRate: ctxExchangeRate,
  } = useBooking();

  // Determine effective exchange rate: prop -> context -> fallback (1535)
  const rate = propExchangeRate ?? ctxExchangeRate ?? 1535;

  // Base USD prices (converted to local)
  const services: Service[] = [
    {
      id: "evisa",
      name: "E-visa (Cost is based on nationality)",
      options: [
        { id: "evisa_uk", name: "UK", price: 650 * rate },
        { id: "evisa_us", name: "US", price: 450 * rate },
        { id: "evisa_italy", name: "Italy", price: 635 * rate },
        { id: "evisa_germany", name: "Germany", price: 635 * rate },
        { id: "evisa_russia", name: "Russia", price: 550 * rate },
        { id: "evisa_india", name: "India", price: 750 * rate },
        { id: "evisa_china", name: "China", price: 550 * rate },
        { id: "evisa_norway", name: "Norway", price: 515 * rate },
        { id: "evisa_sa", name: "South Africa", price: 625 * rate },
        { id: "evisa_france", name: "France", price: 625 * rate },
      ],
    },
    {
      id: "vip_protocol",
      name: "VIP airport protocol (VIP meet & greet, airport concierge services)",
      price: 110000,
    },
    {
      id: "pickup_suv",
      name: "Airport pickup & transfer",
      price: 193600,
    },
    {
      id: "flight_tickets",
      name: "Flight tickets (Inbound Benin, Outbound Lagos)",
      price: 504000,
    },
  ];

  const handleServiceToggle = (serviceId: string) => {
    const newServices = selectedServices.includes(serviceId)
      ? selectedServices.filter((id) => id !== serviceId)
      : [...selectedServices, serviceId];

    setSelectedServices(newServices);
    onUpdate(newServices);
  };

  const addServiceToCart = (item: {
    id: string;
    name: string;
    price: number;
  }) => {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      category: "Service",
      details: undefined,
    };
    onAddToCart(cartItem);

    toast({
      title: "Item Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium mb-4 block">
          Please choose your preferred service(s) *
        </Label>
        <p className="text-sm text-muted-foreground mb-6">
          This includes but is not limited to all relevant services to ensure a
          smooth stay.
        </p>

        <div className="space-y-4">
          {services.map((service) => {
            // ✅ Special handling for e-visa: only show applicant's country
            if (service.id === "evisa" && applicantCountry) {
              const option = service.options?.find(
                (opt) =>
                  opt.name.toLowerCase() === applicantCountry.toLowerCase()
              );

              if (!option) return null; // No match, skip rendering

              const formattedPrice = formatCurrency(
                convertPrice(option.price, currency),
                currency
              );

              return (
                <Card
                  key={option.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={option.id}
                        checked={selectedServices.includes(option.id)}
                        onCheckedChange={() => handleServiceToggle(option.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={option.id}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {service.name} – {option.name}
                        </Label>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {formattedPrice}
                          </Badge>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              addServiceToCart({
                                id: option.id,
                                name: `${service.name} – ${option.name}`,
                                price: option.price,
                              })
                            }
                            className="text-xs"
                            disabled={!selectedServices.includes(option.id)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }

            // Normal services
            if (!service.options) {
              const price = service.price ?? 0;
              const formattedPrice = formatCurrency(
                convertPrice(price, currency),
                currency
              );

              return (
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
                            {formattedPrice}
                          </Badge>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              addServiceToCart({
                                id: service.id,
                                name: service.name,
                                price,
                              })
                            }
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
              );
            }

            return null; // fallback
          })}
        </div>
      </div>
    </div>
  );
};
