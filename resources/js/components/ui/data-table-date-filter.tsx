"use client"

import * as React from "react"
import { DatePicker } from "@/components/ui/date-picker"
import { type DateRange } from "react-day-picker"

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>()

  return (
    <DatePicker
      date={date}
      onDateChange={(d) => setDate(d as Date)}
      className="w-[280px]"
    />
  )
}

export function DatePickerWithRange({
  value,
  onChange,
  placeholder = "Pick a date range",
}: {
  value?: DateRange
  onChange: (date: DateRange | undefined) => void
  placeholder?: string
}) {
  return (
    <DatePicker
      mode="range"
      date={value}
      onDateChange={(d) => onChange(d as DateRange)}
      placeholder={placeholder}
      className="w-[280px]"
    />
  )
}

export const DataTableDateFilter = DatePickerWithRange
