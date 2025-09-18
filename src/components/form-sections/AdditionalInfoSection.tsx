import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalInfoSectionProps {
  comments: string;
  onUpdate: (section: string, data: any) => void;
}

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  comments,
  onUpdate,
}) => {
  return (
    <div className="space-y-8">
      {/* Comments */}
      <div>
        <Label htmlFor="comments" className="text-base font-medium mb-3 block">
          Comments (Additional requests)
        </Label>
        <Textarea
          id="comments"
          value={comments}
          onChange={(e) => onUpdate("comments", e.target.value)}
          placeholder="Please share any additional requests or comments..."
          className="min-h-[120px] resize-none"
        />
      </div>

      {/* Final Note */}
      <div className="bg-primary/5 p-6 rounded-lg">
        <h3 className="font-semibold text-primary mb-2">
          Ready to complete your booking?
        </h3>
        <p className="text-sm text-muted-foreground">
          Review your selections in the cart and proceed to payment. You can pay
          in either Naira or USD. All payments are processed securely through
          Paystack.
        </p>
      </div>
    </div>
  );
};
