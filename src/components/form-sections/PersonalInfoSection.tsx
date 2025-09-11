import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PersonalInfoData {
  name: string;
  email: string;
  phone: string;
}

interface PersonalInfoSectionProps {
  data: PersonalInfoData;
  onUpdate: (data: Partial<PersonalInfoData>) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ data, onUpdate }) => {
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});

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
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
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
        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <Label htmlFor="phone" className="text-base font-medium">
          Phone Number <span className="text-red-500">*</span>
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
        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
      </div>
    </div>
  );
};
