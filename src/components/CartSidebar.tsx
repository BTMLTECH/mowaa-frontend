import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { X, Trash2, CreditCard, DollarSign, Edit2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CartItem } from './MOWAAForm';
import { useBooking } from '@/hooks/BookingContext';
import { api } from '@/lib/api';
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

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
  const { formData, cartItems, error, setError } = useBooking();
  const [showUSD, setShowUSD] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Fetch exchange rate
  useEffect(() => {
    api.getExchangeRate()
      .then(data => {
        if (data?.rate) {
          setExchangeRate(data.rate);
        } else {
          setError("Failed to load exchange rate. Using fallback.");
          setExchangeRate(1550);
        }
      })
      .catch(err => {
        console.error("Failed to fetch exchange rate:", err);
        setError("Could not fetch exchange rate. Using fallback.");
        setExchangeRate(1550);
      });
  }, []);

  // Convert individual item price based on selected currency
  const convertPrice = (price: number, currency: 'NGN' | 'USD') => {
    if (currency === 'USD' && exchangeRate) {
      return parseFloat((price / exchangeRate).toFixed(2));
    }
    return price;
  };

  // Format currency for display
  const formatCurrency = (amount: number, currency: 'NGN' | 'USD') => {
    if (currency === 'NGN') return `₦${amount.toLocaleString()}`;
    return `$${amount.toFixed(2)}`;
  };

  // Calculate totals based on selected currency
  const totalAmount = items.reduce((sum, item) => sum + convertPrice(item.price, showUSD ? 'USD' : 'NGN'), 0);

  // Handle payment
  // const handlePayment = async (currency: 'NGN' | 'USD') => {
  //   try {
  //     if (!exchangeRate) {
  //       setError("Exchange rate not loaded. Please try again.");
  //       return;
  //     }

  //     const normalizedFormData = {
  //       ...formData,
  //       services: Array.isArray(formData.services)
  //         ? formData.services
  //         : Object.values(formData.services),
  //     };

  //     // Convert all cart items to selected currency
  //     const convertedCartItems = cartItems.map(item => ({
  //       ...item,
  //       price: convertPrice(item.price, currency),
  //     }));

  //     const totalAmountToSend = convertedCartItems.reduce((sum, item) => sum + item.price, 0);

  //     const data = await api.initiatePayment({
  //       formData: normalizedFormData,
  //       cartItems: convertedCartItems,
  //       totalAmount: totalAmountToSend,
  //       currency,
  //     });

  //     if (data.url) {
  //       window.location.href = data.url;
  //     } else {
  //       setError("Failed to start payment. Please try again.");
  //     }
  //   } catch (err) {
  //     console.error("Payment error:", err);
  //     setError("Payment request failed. Please check your connection.");
  //   }
  // };

  const handlePayment = async (currency: 'NGN' | 'USD') => {
  try {
    if (!exchangeRate) {
      setError("Exchange rate not loaded. Please try again.");
      return;
    }

    const normalizedFormData = {
      ...formData,
      services: Array.isArray(formData.services)
        ? formData.services
        : Object.values(formData.services),
    };

    const convertedCartItems = cartItems.map(item => ({
      ...item,
      price: convertPrice(item.price, currency),
    }));

    const totalAmountToSend = convertedCartItems.reduce((sum, item) => sum + item.price, 0);

    // Initialize payment via backend
    const data = await api.initiatePayment({
      formData: normalizedFormData,
      cartItems: convertedCartItems,
      totalAmount: totalAmountToSend,
      currency,
    });

    if (!data.reference) {
      setError("Failed to start payment. Please try again.");
      return;
    }

    // Launch Paystack modal
    const handler = (window as any).PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: normalizedFormData.personalInfo.email,
      amount: totalAmountToSend * 100, // in kobo
      currency,
      ref: data.reference,
      metadata: { name: normalizedFormData.personalInfo.name },

      onSuccess: async (transaction: any) => {
        try {
          const result = await api.verifyPayment(transaction.reference);
          if (result.success) {
            alert("Payment successful and verified! Confirmation email sent.");
          } else {
            alert("Payment succeeded but verification failed.");
          }
        } catch (err) {
          console.error("Verification error:", err);
          alert("Payment verification error.");
        }
      },

      // ✅ User cancelled
      onCancel: () => {
        console.log("User cancelled payment");
        alert("Payment cancelled.");
      },

      // ✅ Error loading modal
      onError: (err: any) => {
        console.error("Paystack error:", err.message);
        setError(`Payment error: ${err.message}`);
      },

      // ✅ Optional elements mount (Apple Pay / Card detection)
      onElementsMount: (elements: any) => {
        if (elements) console.log("Elements mounted:", elements);
        else console.log("Elements not supported");
      },
    });

    handler.openIframe(); // Opens Paystack modal
  } catch (err) {
    console.error("Payment initialization failed:", err);
    setError("Payment request failed. Please try again.");
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
              {/* Currency Toggle */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="currency-toggle" className="text-sm font-medium">
                        Show USD equivalent
                      </Label>
                    </div>
                    <Switch
                      id="currency-toggle"
                      checked={showUSD}
                      onCheckedChange={setShowUSD}
                    />
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    {exchangeRate
                      ? `Exchange rate: ₦${exchangeRate.toLocaleString()} = $1`
                      : 'Loading exchange rate...'}
                  </div>
                </CardContent>
              </Card>

              {/* Cart Items */}
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
                    {items.map(item => (
                      <Card key={item.id} className="shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-medium text-sm">{item.name}</h3>
                              <Badge variant="secondary" className="text-xs mt-1">{item.category}</Badge>
                              {item.details && (
                                <p className="text-xs text-muted-foreground mt-1">{item.details}</p>
                              )}
                              <div className="mt-2">
                                <p className="font-semibold text-sm">
                                  {formatCurrency(convertPrice(item.price, showUSD ? 'USD' : 'NGN'), showUSD ? 'USD' : 'NGN')}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {onEditItem && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onEditItem(item)}
                                  className="text-primary hover:text-primary/80"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </Button>
                              )}
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
                            {formatCurrency(totalAmount, showUSD ? 'USD' : 'NGN')}
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
      setIsLoading(true);  // start loader
      await handlePayment(showUSD ? 'USD' : 'NGN');
      setIsLoading(false); // will only reset if payment fails
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
    {isLoading ? 'Processing...' : `Pay ${formatCurrency(totalAmount, showUSD ? 'USD' : 'NGN')}`}
  </Button>
</div>


                  <p className="text-xs text-muted-foreground text-center mt-4">
                    You will be redirected to Paystack for secure payment processing
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
