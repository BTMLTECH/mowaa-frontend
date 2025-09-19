import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PersonalInfoSection } from "./form-sections/PersonalInfoSection";
import { TravelInfoSection } from "./form-sections/TravelInfoSection";
import { ServiceRequestSection } from "./form-sections/ServiceRequestSection";
// import { HotelAccommodationSection } from "./form-sections/HotelAccommodationSection";
import { AdditionalInfoSection } from "./form-sections/AdditionalInfoSection";
import { FormProgress } from "./FormProgress";
import { CartSidebar } from "./CartSidebar";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useBooking } from "@/hooks/BookingContext";
import { EntryIntoNigeriaSection } from "./form-sections/EntryIntoNigeriaSection";
import { LagosAccommodationSection } from "./form-sections/LagosAccommodationSection";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  details?: string;
}

export interface FormDatas {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    requiresVisa: string;
    country?: string;
  };
  entryIntoNigeria: {
    travelDocument: string;
    otherDocumentDetails: string;
    passportScan: File | null;
    passportPhoto: File | null;
    flightProof: File | null;
    signedLetter: File | null;
  };
  travelInfo: {
    // 1. Arrival in Lagos
    arrivalLagosDate: string;
    arrivalLagosTime: string;
    arrivalLagosAirline: string;
    arrivalLagosFlight: string;

    // 2. Departure from Lagos
    departureLagosDate: string;
    departureLagosTime: string;
    departureLagosAirline: string;
    departureLagosFlight: string;

    // 3. Arrival in Benin
    arrivalBeninDate: string;

    // 4. Departure from Benin
    departureBeninDate: string;
  };
  services: string[];
  hotel: string;
  comments: string;
}

const sections = [
  {
    id: "personal",
    title: "Personal Information",
    description: "Provide your personal details",
  },
  {
    id: "entry",
    title: "Entry into Nigeria",
    description: "Upload your travel documents",
  },
  {
    id: "travel",
    title: "Travel Information",
    description: "Your travel details",
  },

  {
    id: "hotel",
    title: "Hotel & Accommodation",
    description: "Choose your hotel and room",
  },
  {
    id: "services",
    title: "Service Request",
    description: "Select services you want",
  },

  {
    id: "additional",
    title: "Additional Information",
    description: "Other important details",
  },
];

export const MOWAAForm: React.FC = () => {
  const {
    formData,
    setFormData,
    cartItems,
    setCartItems,
    currency,
    setCurrency,

    exchangeRate,
  } = useBooking();
  const [currentSection, setCurrentSection] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addToCart = (item: CartItem) => {
    if (!item) return;
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, price: cartItem.price + item.price }
            : cartItem
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateFormData = (section: keyof FormDatas, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]:
        typeof prev[section] === "object"
          ? { ...prev[section], ...data }
          : data,
    }));
  };

  const validateSection = () => {
    switch (currentSection) {
      case 0: // personal info
        return !!(
          formData.personalInfo.name?.trim() &&
          formData.personalInfo.email?.trim() &&
          formData.personalInfo.phone?.trim() &&
          formData.personalInfo.requiresVisa?.trim() &&
          formData.personalInfo.country?.trim()
        );

      case 1: // entry into Nigeria
        return !!(
          // formData.entryIntoNigeria.travelDocument?.trim() &&
          // (formData.entryIntoNigeria.travelDocument !== "Other" ||
          //   formData.entryIntoNigeria.otherDocumentDetails?.trim()) &&
          (
            formData.entryIntoNigeria.passportScan instanceof File &&
            formData.entryIntoNigeria.passportPhoto instanceof File &&
            formData.entryIntoNigeria.flightProof instanceof File &&
            formData.entryIntoNigeria.signedLetter instanceof File
          )
        );

      // case 2: // travel info
      //   return !!(
      //     formData.travelInfo.arrivalDate?.trim() &&
      //     formData.travelInfo.departureDate?.trim() &&
      //     formData.travelInfo.airline?.trim() &&
      //     formData.travelInfo.flightNumber?.trim()
      //   );

      case 2: // travel info
        return !!(
          formData.travelInfo.arrivalLagosDate?.trim() &&
          formData.travelInfo.arrivalLagosTime?.trim() &&
          formData.travelInfo.arrivalLagosAirline?.trim() &&
          formData.travelInfo.arrivalLagosFlight?.trim() &&
          formData.travelInfo.departureLagosDate?.trim() &&
          formData.travelInfo.departureLagosTime?.trim() &&
          formData.travelInfo.departureLagosAirline?.trim() &&
          formData.travelInfo.departureLagosFlight?.trim() &&
          formData.travelInfo.arrivalBeninDate?.trim() &&
          formData.travelInfo.departureBeninDate?.trim()
        );

      case 3: // Lagos Accommodation
        return !!formData.hotel?.trim();

      default:
        return true;
    }
  };

  const nextSection = () => {
    if (!validateSection()) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (
      sections[currentSection].id === "personal" &&
      formData.personalInfo?.requiresVisa === "no"
    ) {
      setCurrentSection(sections.findIndex((s) => s.id === "services"));
      return;
    }

    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handleFormSubmit = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description:
          "Please add at least one service or hotel option before proceeding.",
        variant: "destructive",
      });
      return;
    }
    setIsCartOpen(true);
  };

  const prevSection = () => {
    // ✅ If visa = "no" and we are on "services" (section 4), go straight back to "personal"
    if (
      sections[currentSection].id === "services" &&
      formData.personalInfo?.requiresVisa === "no"
    ) {
      setCurrentSection(sections.findIndex((s) => s.id === "personal"));
      return;
    }

    // Default behavior
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <PersonalInfoSection
            data={formData.personalInfo}
            onUpdate={(data) => updateFormData("personalInfo", data)}
          />
        );

      case 1:
        return (
          <EntryIntoNigeriaSection
            data={formData.entryIntoNigeria}
            onUpdate={(updatedData) => {
              setFormData((prev) => ({
                ...prev,
                entryIntoNigeria: {
                  ...prev.entryIntoNigeria,
                  ...updatedData,
                },
              }));
            }}
          />
        );

      case 2:
        return (
          <TravelInfoSection
            data={formData.travelInfo}
            onUpdate={(data) => updateFormData("travelInfo", data)}
          />
        );

      case 3:
        return (
          <LagosAccommodationSection
            hotel={formData.hotel}
            onUpdate={(data) => updateFormData("hotel", data.hotel)}
          />
        );

      case 4:
        return (
          <ServiceRequestSection
            data={formData.services}
            onUpdate={(data) => updateFormData("services", data)}
            onAddToCart={addToCart}
            exchangeRate={exchangeRate}
            applicantCountry={formData.personalInfo.country}
          />
        );

      case 5:
        return (
          <AdditionalInfoSection
            // stayInBenin={formData.stayInBenin}
            // beninDuration={formData.beninDuration}
            comments={formData.comments}
            onUpdate={updateFormData}
            // currency={currency}
            // exchangeRate={exchangeRate}
            // onAddToCart={addToCart}
            // convertPrice={convertPrice}
            // formatCurrency={formatCurrency}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Title */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                MOWAA OPENING - NIGERIA VISIT
              </h1>
              <p className="text-lg opacity-90">November 2025</p>
            </div>

            {/* Cart + Currency Switcher */}
            <div className="flex flex-col items-end space-y-3">
              {/* Cart button */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsCartOpen(true)}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 shadow-lg rounded-xl"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Cart ({cartItems.length})
              </Button>

              {/* Label + Switcher */}
              <div className="flex items-center space-x-2">
                {/* Prefix helper word */}
                <span className="text-sm md:text-base font-medium text-white/90">
                  Currency
                </span>

                {/* iOS-like currency switcher */}
                <button
                  onClick={() =>
                    setCurrency(currency === "NGN" ? "USD" : "NGN")
                  }
                  className={`
              relative w-24 h-9 rounded-full flex items-center
              transition-colors duration-300 ease-in-out
              bg-white/20 border border-white/30
              shadow-md overflow-hidden
            `}
                >
                  {/* Sliding background */}
                  <span
                    className={`
                absolute top-0 left-0 w-1/2 h-full rounded-full
                bg-white text-black flex items-center justify-center text-sm font-semibold
                transform transition-transform duration-300
                ${currency === "USD" ? "translate-x-full" : ""}
              `}
                  >
                    {currency === "NGN" ? "₦" : "$"}
                  </span>

                  {/* Static labels */}
                  <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-semibold">
                    <span>NGN</span>
                    <span>USD</span>
                  </div>
                </button>
              </div>

              {/* Exchange rate under toggle */}
              {exchangeRate && (
                <p className="text-xs text-white italic">
                  1 USD ≈ ₦{exchangeRate.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Form Progress */}
          <FormProgress currentSection={currentSection} sections={sections} />

          {/* Welcome Message */}
          <Card className="mb-8 shadow-elegant">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                As we draw nearer to your visit to Nigeria for MOWAA's opening
                in November, we would like you to provide us with the
                information requested via this form and also to proceed with
                making necessary payments which will only take about 15 minutes
                to enable us make relevant arrangements to ensure you have a
                smooth and seamless experience with your visit to Nigeria.
              </p>
              <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                <p className="text-sm text-foreground">
                  <strong>IMPORTANT!</strong> Please note that any service or
                  information not specified here can always be requested at{" "}
                  <a
                    href="mailto:logistics@wearemowaa.org"
                    className="text-primary hover:underline"
                  >
                    logistics@wearemowaa.org
                  </a>{" "}
                  for general logistics and{" "}
                  <a
                    href="mailto:visaenquiry@wearemowaa.org"
                    className="text-primary hover:underline"
                  >
                    visaenquiry@wearemowaa.org
                  </a>{" "}
                  for visa related matters.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Current Section */}
          <Card className="shadow-elegant w-full max-w-4xl mx-auto">
            <CardHeader className="bg-primary/5">
              <div className="space-y-2">
                <CardTitle className="text-lg sm:text-xl md:text-2xl text-primary">
                  {sections[currentSection].title}
                </CardTitle>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {sections[currentSection].description}
                </p>
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  Section {currentSection + 1} of {sections.length}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6">{renderCurrentSection()}</CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevSection}
              disabled={currentSection === 0}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentSection === sections.length - 1 ? (
              <Button
                onClick={handleFormSubmit}
                disabled={isSubmitting || cartItems.length === 0}
                className="flex items-center bg-gradient-primary hover:opacity-90"
              >
                <Send className="mr-2 h-4 w-4" />
                Proceed to Cart & Pay
              </Button>
            ) : (
              <Button
                onClick={nextSection}
                className="flex items-center bg-gradient-primary hover:opacity-90"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={removeFromCart}
        onEditItem={(item) => {
          toast({
            title: "Edit Feature",
            description: "Cart editing functionality coming soon!",
          });
        }}
      />
    </div>
  );
};
