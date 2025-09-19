import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isBefore, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

interface TravelInfoData {
  arrivalLagosDate: string;
  arrivalLagosTime: string;
  arrivalLagosAirline: string;
  arrivalLagosFlight: string;

  departureLagosDate: string;
  departureLagosTime: string;
  departureLagosAirline: string;
  departureLagosFlight: string;

  arrivalBeninDate: string;
  departureBeninDate: string;
}

interface TravelInfoSectionProps {
  data: TravelInfoData;
  onUpdate: (data: Partial<TravelInfoData>) => void;
}

export const TravelInfoSection: React.FC<TravelInfoSectionProps> = ({
  data,
  onUpdate,
}) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof TravelInfoData, string>>
  >({});
  const [openField, setOpenField] = useState<string | null>(null);

  const handleDateSelect = (
    date: Date | undefined,
    field: keyof TravelInfoData
  ) => {
    if (date) {
      onUpdate({ [field]: format(date, "yyyy-MM-dd") });
      setErrors((prev) => ({ ...prev, [field]: "" }));
      setOpenField(null);
    }
  };

  const handleChange = (field: keyof TravelInfoData, value: string) => {
    onUpdate({ [field]: value });
    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const disablePastDates = (date: Date) => {
    return isBefore(date, startOfDay(new Date()));
  };

  return (
    <div className="space-y-8">
      {/* Arrival in Lagos */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Arrival in Lagos</h3>

        {/* Date */}
        <Label>Date of arrival</Label>
        <Popover
          open={openField === "arrivalLagosDate"}
          onOpenChange={(open) =>
            setOpenField(open ? "arrivalLagosDate" : null)
          }
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal mt-2",
                !data.arrivalLagosDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.arrivalLagosDate
                ? format(new Date(data.arrivalLagosDate), "PPP")
                : "Select arrival date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <Calendar
              mode="single"
              selected={
                data.arrivalLagosDate
                  ? new Date(data.arrivalLagosDate)
                  : undefined
              }
              onSelect={(date) => handleDateSelect(date, "arrivalLagosDate")}
              disabled={disablePastDates}
            />
          </PopoverContent>
        </Popover>
        {errors.arrivalLagosDate && (
          <p className="text-sm text-red-500">{errors.arrivalLagosDate}</p>
        )}

        {/* Time */}
        <div className="mt-4">
          <Label htmlFor="arrivalLagosTime">Time of arrival</Label>
          <Input
            id="arrivalLagosTime"
            value={data.arrivalLagosTime}
            onChange={(e) => handleChange("arrivalLagosTime", e.target.value)}
            placeholder="e.g 14:30"
            className="mt-2"
          />
        </div>

        {/* Airline */}
        <div className="mt-4">
          <Label htmlFor="arrivalLagosAirline">Name of Airline</Label>
          <Input
            id="arrivalLagosAirline"
            value={data.arrivalLagosAirline}
            onChange={(e) =>
              handleChange("arrivalLagosAirline", e.target.value)
            }
            placeholder="Enter airline name"
            className="mt-2"
          />
        </div>

        {/* Flight Number */}
        <div className="mt-4">
          <Label htmlFor="arrivalLagosFlight">Flight Number</Label>
          <Input
            id="arrivalLagosFlight"
            value={data.arrivalLagosFlight}
            onChange={(e) => handleChange("arrivalLagosFlight", e.target.value)}
            placeholder="Enter flight number"
            className="mt-2"
          />
        </div>
      </div>

      {/* Departure from Lagos */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Departure from Lagos</h3>

        {/* Date */}
        <Label>Date of departure</Label>
        <Popover
          open={openField === "departureLagosDate"}
          onOpenChange={(open) =>
            setOpenField(open ? "departureLagosDate" : null)
          }
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal mt-2",
                !data.departureLagosDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.departureLagosDate
                ? format(new Date(data.departureLagosDate), "PPP")
                : "Select departure date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <Calendar
              mode="single"
              selected={
                data.departureLagosDate
                  ? new Date(data.departureLagosDate)
                  : undefined
              }
              onSelect={(date) => handleDateSelect(date, "departureLagosDate")}
              disabled={disablePastDates}
            />
          </PopoverContent>
        </Popover>

        {/* Time */}
        <div className="mt-4">
          <Label htmlFor="departureLagosTime">Time of departure</Label>
          <Input
            id="departureLagosTime"
            value={data.departureLagosTime}
            onChange={(e) => handleChange("departureLagosTime", e.target.value)}
            placeholder="e.g 16:20"
            className="mt-2"
          />
        </div>

        {/* Airline */}
        <div className="mt-4">
          <Label htmlFor="departureLagosAirline">Name of Airline</Label>
          <Input
            id="departureLagosAirline"
            value={data.departureLagosAirline}
            onChange={(e) =>
              handleChange("departureLagosAirline", e.target.value)
            }
            placeholder="Enter airline name"
            className="mt-2"
          />
        </div>

        {/* Flight Number */}
        <div className="mt-4">
          <Label htmlFor="departureLagosFlight">Flight Number</Label>
          <Input
            id="departureLagosFlight"
            value={data.departureLagosFlight}
            onChange={(e) =>
              handleChange("departureLagosFlight", e.target.value)
            }
            placeholder="Enter flight number"
            className="mt-2"
          />
        </div>
      </div>

      {/* Arrival in Benin */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Arrival in Benin</h3>
        <Label>Date of arrival</Label>
        <Popover
          open={openField === "arrivalBeninDate"}
          onOpenChange={(open) =>
            setOpenField(open ? "arrivalBeninDate" : null)
          }
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal mt-2",
                !data.arrivalBeninDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.arrivalBeninDate
                ? format(new Date(data.arrivalBeninDate), "PPP")
                : "Select arrival date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <Calendar
              mode="single"
              selected={
                data.arrivalBeninDate
                  ? new Date(data.arrivalBeninDate)
                  : undefined
              }
              onSelect={(date) => handleDateSelect(date, "arrivalBeninDate")}
              disabled={disablePastDates}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Departure from Benin */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Departure from Benin</h3>
        <Label>Date of departure</Label>
        <Popover
          open={openField === "departureBeninDate"}
          onOpenChange={(open) =>
            setOpenField(open ? "departureBeninDate" : null)
          }
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal mt-2",
                !data.departureBeninDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.departureBeninDate
                ? format(new Date(data.departureBeninDate), "PPP")
                : "Select departure date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <Calendar
              mode="single"
              selected={
                data.departureBeninDate
                  ? new Date(data.departureBeninDate)
                  : undefined
              }
              onSelect={(date) => handleDateSelect(date, "departureBeninDate")}
              disabled={disablePastDates}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
