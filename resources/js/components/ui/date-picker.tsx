"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    date?: Date | DateRange
    onDateChange?: (date: Date | DateRange | undefined) => void
    placeholder?: string
    mode?: "single" | "range"
    className?: string
    align?: "start" | "center" | "end"
}

export function DatePicker({
    date,
    onDateChange,
    placeholder = "Pick a date",
    mode = "single",
    className,
    align = "start",
}: DatePickerProps) {
    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal transition-all duration-200 px-2.5",
                            "hover:border-primary/50 hover:bg-accent/50",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                        {mode === "single" ? (
                            date instanceof Date ? (
                                format(date, "PPP")
                            ) : (
                                <span>{placeholder}</span>
                            )
                        ) : (
                            (date as DateRange)?.from ? (
                                (date as DateRange).to ? (
                                    <>
                                        {format((date as DateRange).from!, "LLL dd, y")} -{" "}
                                        {format((date as DateRange).to!, "LLL dd, y")}
                                    </>
                                ) : (
                                    format((date as DateRange).from!, "LLL dd, y")
                                )
                            ) : (
                                <span>{placeholder}</span>
                            )
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align={align}>
                    <Calendar
                        initialFocus
                        mode={mode as any}
                        defaultMonth={mode === "range" ? (date as DateRange)?.from : (date as Date)}
                        selected={date as any}
                        onSelect={onDateChange as any}
                        numberOfMonths={mode === "range" ? 2 : 1}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export function DatePickerWithRange({
    className,
    label = "Date Picker Range",
    value,
    onChange,
}: {
    className?: string
    label?: string
    value?: DateRange
    onChange?: (date: DateRange | undefined) => void
}) {
    const [date, setDate] = React.useState<DateRange | undefined>(value || {
        from: new Date(new Date().getFullYear(), 0, 20),
        to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
    })

    const handleSelect = (newDate: DateRange | undefined) => {
        setDate(newDate)
        if (onChange) onChange(newDate)
    }

    return (
        <Field className={cn("w-60", className)}>
            <FieldLabel htmlFor="date-picker-range">{label}</FieldLabel>
            <DatePicker
                id="date-picker-range"
                mode="range"
                date={date}
                onDateChange={handleSelect as any}
                align="start"
            />
        </Field>
    )
}
