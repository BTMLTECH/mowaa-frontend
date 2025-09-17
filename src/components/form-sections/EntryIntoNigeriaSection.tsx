import React from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface EntryIntoNigeriaData {
  travelDocument: string;
  otherDocumentDetails: string;
  passportScan: File | null;
  passportPhoto: File | null;
  flightProof: File | null;
  signedLetter: File | null;
}

interface EntryIntoNigeriaSectionProps {
  data: EntryIntoNigeriaData;
  onUpdate: (value: Partial<EntryIntoNigeriaData>) => void;
  errors?: Record<string, string>;
}

export const EntryIntoNigeriaSection: React.FC<
  EntryIntoNigeriaSectionProps
> = ({
  data,
  onUpdate,
  errors = {}, // default empty
}) => {
  const { toast } = useToast();

  const handleFileChange = (
    field: keyof EntryIntoNigeriaData,
    file: File | null
  ) => {
    onUpdate({ [field]: file });

    if (file) {
      toast({
        title: "File Selected",
        description: `${file.name} uploaded successfully.`,
      });
    }
  };

  // Helper for conditional input error styling
  const inputErrorClass = (field: keyof EntryIntoNigeriaData) =>
    errors[field]
      ? "border-red-600 focus:border-red-600 focus:ring-red-600"
      : "";

  // Force download handler
  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/application-letter-template.docx"; // must be inside /public
    link.download = "Nigerian-visa-application-letter.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Informational Text */}
      <div className="bg-primary/5 p-4 rounded-lg text-sm space-y-2">
        <p>
          We will be arranging a Visa on Arrival for all guests who require one.
          This is the quickest and most convenient process for entry into
          Nigeria.
        </p>
        <p>In order to initiate the process we ask our guests to supply:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>A scan of the data page of your Passport</li>
          <li>A digital passport photo</li>
          <li>Flight itinerary / proof of flight booking</li>
          <li>Signed application letter (download template below)</li>
        </ul>
        <p>
          Please upload these documents below and make sure that your passport
          is valid for at least 6 months from 7th February 2024. A member of our
          team will be in touch if we require any further documentation.
        </p>
      </div>

      {/* Travel Document Selection */}
      <div>
        <Label className="text-base font-medium mb-4 block">
          What document will you be travelling on?{" "}
          <span className="text-red-500">*</span>
        </Label>
        <RadioGroup
          value={data.travelDocument}
          onValueChange={(value) => onUpdate({ travelDocument: value })}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Nigerian Visa on Arrival",
              "Nigerian Tourist Visa (self organised)",
              "Nigerian Business Visa (self organised)",
              "Nigerian Passport",
              "Other",
            ].map((option) => (
              <Card
                key={option}
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  data.travelDocument === option
                    ? "border-2 border-primary"
                    : ""
                }`}
              >
                <CardContent className="p-4 flex items-center">
                  <RadioGroupItem value={option} id={option} className="mt-1" />
                  <Label htmlFor={option} className="ml-2 cursor-pointer">
                    {option}
                  </Label>
                </CardContent>
              </Card>
            ))}
          </div>
        </RadioGroup>
        {errors.travelDocument && (
          <p className="text-red-600 text-sm mt-1">{errors.travelDocument}</p>
        )}

        {data.travelDocument === "Other" && (
          <>
            <Input
              placeholder="Please provide further details"
              className={`mt-3 ${
                errors.otherDocumentDetails
                  ? "border-red-600 focus:border-red-600 focus:ring-red-600"
                  : ""
              }`}
              value={data.otherDocumentDetails || ""}
              onChange={(e) =>
                onUpdate({ otherDocumentDetails: e.target.value })
              }
            />
            {errors.otherDocumentDetails && (
              <p className="text-red-600 text-sm mt-1">
                {errors.otherDocumentDetails}
              </p>
            )}
          </>
        )}
      </div>

      {/* File Uploads */}
      <div className="space-y-4">
        {/* Passport Scan */}
        <div>
          <Label>
            Passport Data Page Upload <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="image/*,application/pdf"
            className={inputErrorClass("passportScan")}
            onChange={(e) =>
              handleFileChange("passportScan", e.target.files?.[0] || null)
            }
          />
          {data.passportScan && (
            <p className="text-sm text-muted-foreground mt-1">
              Selected file:{" "}
              <span className="font-medium">{data.passportScan.name}</span>
            </p>
          )}
          {errors.passportScan && (
            <p className="text-red-600 text-sm mt-1">{errors.passportScan}</p>
          )}
        </div>

        {/* Passport Photo */}
        <div>
          <Label>
            Digital Passport Photo Upload{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="image/*"
            className={inputErrorClass("passportPhoto")}
            onChange={(e) =>
              handleFileChange("passportPhoto", e.target.files?.[0] || null)
            }
          />
          {data.passportPhoto && (
            <p className="text-sm text-muted-foreground mt-1">
              Selected file:{" "}
              <span className="font-medium">{data.passportPhoto.name}</span>
            </p>
          )}
          {errors.passportPhoto && (
            <p className="text-red-600 text-sm mt-1">{errors.passportPhoto}</p>
          )}
        </div>

        {/* Flight Proof */}
        <div>
          <Label>
            Proof of Flight Booking Upload{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="image/*,application/pdf"
            className={inputErrorClass("flightProof")}
            onChange={(e) =>
              handleFileChange("flightProof", e.target.files?.[0] || null)
            }
          />
          {data.flightProof && (
            <p className="text-sm text-muted-foreground mt-1">
              Selected file:{" "}
              <span className="font-medium">{data.flightProof.name}</span>
            </p>
          )}
          {errors.flightProof && (
            <p className="text-red-600 text-sm mt-1">{errors.flightProof}</p>
          )}
        </div>

        {/* Application Letter */}
        <div>
          <Label className="block text-base font-medium mb-2">
            Application Letter <span className="text-red-500">*</span>
          </Label>

          <Button
            type="button"
            onClick={handleDownloadTemplate}
            className="px-4 py-2 bg-primary text-white rounded-md shadow hover:bg-primary/90"
          >
            Download Application Letter
          </Button>

          <p className="text-sm text-muted-foreground mt-2">
            Please download the letter, sign it, and upload the signed copy
            below.
          </p>

          <Input
            type="file"
            accept="application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,image/*"
            className={`mt-3 ${inputErrorClass("signedLetter")}`}
            onChange={(e) =>
              handleFileChange("signedLetter", e.target.files?.[0] || null)
            }
          />
          {data.signedLetter && (
            <p className="text-sm text-muted-foreground mt-1">
              Selected file:{" "}
              <span className="font-medium">{data.signedLetter.name}</span>
            </p>
          )}
          {errors.signedLetter && (
            <p className="text-red-600 text-sm mt-1">{errors.signedLetter}</p>
          )}
        </div>
      </div>
    </div>
  );
};
