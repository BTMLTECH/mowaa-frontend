import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface AdditionalInfoSectionProps {
  stayInBenin: string;
  beninDuration: string;
  comments: string;
  onUpdate: (section: string, data: any) => void;
}

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  stayInBenin,
  beninDuration,
  comments,
  onUpdate
}) => {
  const [customDuration, setCustomDuration] = useState('');

  return (
    <div className="space-y-8">
      {/* Stay in Benin */}
      <div>
        <Label className="text-base font-medium mb-4 block">
          Do you have plans to stay back in Benin City, after the 9th of November, 2025?
        </Label>
        <RadioGroup
          value={stayInBenin}
          onValueChange={(value) => {
            onUpdate('stayInBenin', value);
            if (value === 'no') {
              onUpdate('beninDuration', '');
              setCustomDuration('');
            }
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="stay-yes" />
                  <Label htmlFor="stay-yes" className="font-medium cursor-pointer">
                    Yes
                  </Label>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="stay-no" />
                  <Label htmlFor="stay-no" className="font-medium cursor-pointer">
                    No
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </RadioGroup>
      </div>

      {/* Duration in Benin */}
      {stayInBenin === 'yes' && (
        <div>
          <Label className="text-base font-medium mb-3 block">
            Please specify number of days *
          </Label>
          <Select
            value={beninDuration}
            onValueChange={(value) => {
              onUpdate('beninDuration', value);
              if (value !== 'other') {
                setCustomDuration('');
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 day</SelectItem>
              <SelectItem value="2">2 days</SelectItem>
              <SelectItem value="3">3 days</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          {beninDuration === 'other' && (
            <div className="mt-3">
              <Input
                type="number"
                min={1}
                placeholder="Enter number of days"
                value={customDuration}
                onChange={(e) => {
                  setCustomDuration(e.target.value);
                  onUpdate('beninDuration', e.target.value);
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Comments */}
      <div>
        <Label htmlFor="comments" className="text-base font-medium mb-3 block">
          Comments (Additional requests)
        </Label>
        <Textarea
          id="comments"
          value={comments}
          onChange={(e) => onUpdate('comments', e.target.value)}
          placeholder="Please share any additional requests or comments..."
          className="min-h-[120px] resize-none"
        />
      </div>

      {/* Final Note */}
      <div className="bg-primary/5 p-6 rounded-lg">
        <h3 className="font-semibold text-primary mb-2">Ready to complete your booking?</h3>
        <p className="text-sm text-muted-foreground">
          Review your selections in the cart and proceed to payment. You can pay in either Naira or USD.
          All payments are processed securely through Paystack.
        </p>
      </div>
    </div>
  );
};
