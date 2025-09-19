import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface PersonalInfoData {
  name: string;
  email: string;
  phone: string;
  requiresVisa: string;
  country?: string;
}

const visaCountries = [
  "UK",
  "US",
  "Italy",
  "Germany",
  "Russia",
  "India",
  "China",
  "Norway",
  "South Africa",
  "France",
];
interface PersonalInfoSectionProps {
  data: PersonalInfoData;
  onUpdate: (data: Partial<PersonalInfoData>) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  data,
  onUpdate,
}) => {
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  const validateField = (field: string, value: string) => {
    let error = "";

    if (!value.trim()) {
      error = "This field is required.";
    } else if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = "Enter a valid email address.";
      }
    } else if (field === "phone") {
      const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
      if (!phoneRegex.test(value)) {
        error = "Enter a valid phone number.";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <Label htmlFor="name" className="text-base font-medium">
          Name (As shown on Passport) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => {
            onUpdate({ name: e.target.value });
            validateField("name", e.target.value);
          }}
          onBlur={(e) => validateField("name", e.target.value)}
          placeholder="Enter your full name"
          className="mt-2"
          required
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <Label htmlFor="email" className="text-base font-medium">
          Email Address <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => {
            onUpdate({ email: e.target.value });
            validateField("email", e.target.value);
          }}
          onBlur={(e) => validateField("email", e.target.value)}
          placeholder="Enter your email address"
          className="mt-2"
          required
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="phone" className="text-base font-medium">
          Whatsapp Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="phone"
          value={data.phone}
          onChange={(e) => {
            onUpdate({ phone: e.target.value });
            validateField("phone", e.target.value);
          }}
          onBlur={(e) => validateField("phone", e.target.value)}
          placeholder="e.g +1 (201) 345-875, +44 20 3412 2002"
          className="mt-2"
          required
        />
        {errors.phone && (
          <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <Label className="text-base font-medium">
          Do you require a Visa? <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          className="mt-2 flex gap-4"
          value={data.requiresVisa}
          onValueChange={(value) => onUpdate({ requiresVisa: value })}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="yes" id="visa-yes" />
            <Label htmlFor="visa-yes">Yes</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="no" id="visa-no" />
            <Label htmlFor="visa-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {/* ✅ Show Country selector only if Yes */}
      {data.requiresVisa === "yes" && (
        <div>
          <Label className="text-base font-medium">
            Select your country <span className="text-red-500">*</span>
          </Label>
          <Select
            value={data.country || ""}
            onValueChange={(value) => onUpdate({ country: value })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              {visaCountries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
