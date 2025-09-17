import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Trash2, CreditCard } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem } from "./MOWAAForm";
import { useBooking } from "@/hooks/BookingContext";
import { api } from "@/lib/api";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (itemId: string) => void;
  onEditItem?: (item: CartItem) => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onEditItem,
}) => {
  const {
    formData,
    cartItems,
    error,
    setError,
    currency,
    convertPrice,
    exchangeRate,
    formatCurrency,
  } = useBooking();

  const [isLoading, setIsLoading] = useState(false);

  const totalAmount = items.reduce(
    (sum, item) => sum + convertPrice(item.price, currency),
    0
  );

  const handlePayment = async (currency) => {
    try {
      if (!exchangeRate) {
        setError("Exchange rate not loaded. Please try again.");
        return;
      }

      // normalize services etc.
      const normalizedFormData = {
        ...formData,
        services: Array.isArray(formData.services)
          ? formData.services
          : Object.values(formData.services),
      };

      const convertedCartItems = cartItems.map((item) => ({
        ...item,
        price: convertPrice(item.price, currency),
      }));
      const totalAmountToSend = convertedCartItems.reduce(
        (sum, i) => sum + i.price,
        0
      );

      // Build payload object (but remove File objects before JSON.stringify)
      const payloadForJson = {
        formData: {
          ...normalizedFormData,
          entryIntoNigeria: {
            // include text fields only
            travelDocument: normalizedFormData.entryIntoNigeria.travelDocument,
            otherDocumentDetails:
              normalizedFormData.entryIntoNigeria.otherDocumentDetails || "",
          },
        },
        cartItems: convertedCartItems,
        totalAmount: totalAmountToSend,
        currency,
      };

      // Build FormData
      const fd = new FormData();
      fd.append("data", JSON.stringify(payloadForJson));

      // Append files (only if they are real File objects)
      const passportScan = normalizedFormData.entryIntoNigeria.passportScan;
      const passportPhoto = normalizedFormData.entryIntoNigeria.passportPhoto;
      const flightProof = normalizedFormData.entryIntoNigeria.flightProof;
      const signedLetter = normalizedFormData.entryIntoNigeria.signedLetter;

      if (passportScan instanceof File) {
        fd.append("passportScan", passportScan, passportScan.name);
      }
      if (passportPhoto instanceof File) {
        fd.append("passportPhoto", passportPhoto, passportPhoto.name);
      }
      if (flightProof instanceof File) {
        fd.append("flightProof", flightProof, flightProof.name);
      }
      if (signedLetter instanceof File) {
        fd.append("signedLetter", signedLetter, signedLetter.name);
      }

      for (const pair of fd.entries()) {
      }

      // send FormData to API
      const data = await api.initiatePayment(fd);

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Failed to start payment. Please try again.");
      }
    } catch (err) {
      setError("Payment request failed. Please check your connection.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
      <div className="w-full max-w-md bg-background h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-background/95 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Your Cart</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Your cart is empty</p>
                    <p className="text-sm">Add services to get started</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <Card key={item.id} className="shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-medium text-sm">
                                {item.name}
                              </h3>
                              <Badge
                                variant="secondary"
                                className="text-xs mt-1"
                              >
                                {item.category}
                              </Badge>
                              {item.details && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {item.details}
                                </p>
                              )}
                              <div className="mt-2">
                                <p className="font-semibold text-sm">
                                  {formatCurrency(
                                    convertPrice(item.price, currency),
                                    currency
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemoveItem(item.id)}
                                className="text-destructive hover:text-destructive/80"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Separator className="my-6" />

                  {/* Total */}
                  <Card className="mb-6 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total</span>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {formatCurrency(totalAmount, currency)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment */}
                  <div className="space-y-3">
                    {error && (
                      <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-200 p-2 rounded">
                        {error}
                      </div>
                    )}

                    <Button
                      onClick={async () => {
                        setIsLoading(true);
                        await handlePayment(currency);
                        setIsLoading(false);
                      }}
                      className="w-full bg-gradient-primary hover:opacity-90 flex justify-center items-center"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      ) : (
                        <CreditCard className="mr-2 h-5 w-5" />
                      )}
                      {isLoading
                        ? "Processing..."
                        : `Pay ${formatCurrency(totalAmount, currency)}`}
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    You will be redirected to Paystack for secure payment
                    processing
                  </p>
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
