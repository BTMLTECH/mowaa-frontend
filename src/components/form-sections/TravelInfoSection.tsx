import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isBefore, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';

interface TravelInfoData {
  arrivalDate: string;
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  departureDate: string;
  departureTimeFromLagos: string;
}

interface TravelInfoSectionProps {
  data: TravelInfoData;
  onUpdate: (data: Partial<TravelInfoData>) => void;
}

export const TravelInfoSection: React.FC<TravelInfoSectionProps> = ({ data, onUpdate }) => {
  const [errors, setErrors] = useState<Partial<Record<keyof TravelInfoData, string>>>({});
  const [arrivalOpen, setArrivalOpen] = useState(false);
  const [departureOpen, setDepartureOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined, field: 'arrivalDate' | 'departureDate') => {
    if (date) {
      onUpdate({ [field]: format(date, 'yyyy-MM-dd') });
      setErrors((prev) => ({ ...prev, [field]: '' }));
      // Close popover after selection
      if (field === 'arrivalDate') setArrivalOpen(false);
      if (field === 'departureDate') setDepartureOpen(false);
    }
  };

  const handleChange = (field: keyof TravelInfoData, value: string) => {
    onUpdate({ [field]: value });
    if (value.trim() !== '') {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const disablePastDates = (date: Date) => {
    return isBefore(date, startOfDay(new Date()));
  };

  return (
    <div className="space-y-6">
      {/* Arrival Date */}
      <div>
        <Label className="text-base font-medium">
          Date of arrival to Lagos, Nigeria <span className="text-red-500">*</span>
        </Label>
        <Popover open={arrivalOpen} onOpenChange={setArrivalOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal mt-2",
                !data.arrivalDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.arrivalDate ? format(new Date(data.arrivalDate), 'PPP') : 'Select arrival date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={data.arrivalDate ? new Date(data.arrivalDate) : undefined}
              onSelect={(date) => handleDateSelect(date, 'arrivalDate')}
              disabled={disablePastDates}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        {errors.arrivalDate && <p className="text-sm text-red-500 mt-1">{errors.arrivalDate}</p>}
      </div>

      {/* Airline */}
      <div>
        <Label htmlFor="airline" className="text-base font-medium">
          Name of airline <span className="text-red-500">*</span>
        </Label>
        <Input
          id="airline"
          value={data.airline}
          onChange={(e) => handleChange('airline', e.target.value)}
          placeholder="Enter airline name"
          className="mt-2"
          required
        />
        {errors.airline && <p className="text-sm text-red-500 mt-1">{errors.airline}</p>}
      </div>

      {/* Flight Number */}
      <div>
        <Label htmlFor="flightNumber" className="text-base font-medium">
          Flight number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="flightNumber"
          value={data.flightNumber}
          onChange={(e) => handleChange('flightNumber', e.target.value)}
          placeholder="Enter flight number"
          className="mt-2"
          required
        />
        {errors.flightNumber && <p className="text-sm text-red-500 mt-1">{errors.flightNumber}</p>}
      </div>

      {/* Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="departureTime" className="text-base font-medium">
            Departure time <span className="text-red-500">*</span>
          </Label>
          <Input
            id="departureTime"
            value={data.departureTime}
            onChange={(e) => handleChange('departureTime', e.target.value)}
            placeholder="e.g 14:30"
            className="mt-2"
            required
          />
          {errors.departureTime && <p className="text-sm text-red-500 mt-1">{errors.departureTime}</p>}
        </div>

        <div>
          <Label htmlFor="arrivalTime" className="text-base font-medium">
            Arrival time to Lagos, Nigeria <span className="text-red-500">*</span>
          </Label>
          <Input
            id="arrivalTime"
            value={data.arrivalTime}
            onChange={(e) => handleChange('arrivalTime', e.target.value)}
            placeholder="e.g 08:45"
            className="mt-2"
            required
          />
          {errors.arrivalTime && <p className="text-sm text-red-500 mt-1">{errors.arrivalTime}</p>}
        </div>
      </div>

      {/* Departure Date */}
      <div>
        <Label className="text-base font-medium">
          Date of departure from Lagos, Nigeria <span className="text-red-500">*</span>
        </Label>
        <Popover open={departureOpen} onOpenChange={setDepartureOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal mt-2",
                !data.departureDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.departureDate ? format(new Date(data.departureDate), 'PPP') : 'Select departure date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={data.departureDate ? new Date(data.departureDate) : undefined}
              onSelect={(date) => handleDateSelect(date, 'departureDate')}
              disabled={disablePastDates}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        {errors.departureDate && <p className="text-sm text-red-500 mt-1">{errors.departureDate}</p>}
      </div>

      {/* Departure Time from Lagos */}
      <div>
        <Label htmlFor="departureTimeFromLagos" className="text-base font-medium">
          Time of departure from Lagos, Nigeria <span className="text-red-500">*</span>
        </Label>
        <Input
          id="departureTimeFromLagos"
          value={data.departureTimeFromLagos}
          onChange={(e) => handleChange('departureTimeFromLagos', e.target.value)}
          placeholder="e.g 16:20"
          className="mt-2"
          required
        />
        {errors.departureTimeFromLagos && <p className="text-sm text-red-500 mt-1">{errors.departureTimeFromLagos}</p>}
      </div>
    </div>
  );
};
