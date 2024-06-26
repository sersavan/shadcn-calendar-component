"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { CalendarDatePicker } from "@/components/calendar-date-picker";

const FormSchema = z.object({
  calendar: z.object({
    from: z.date(),
    to: z.date(),
  }),
  datePicker: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      calendar: {
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(),
      },
      datePicker: {
        from: new Date(),
        to: new Date(),
      },
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    toast(
      `1. Date range: ${data.calendar.from.toDateString()} - ${data.calendar.to.toDateString()}
      \n2. Single date: ${data.datePicker.from.toDateString()}`
    );
  };

  return (
    <main className="flex min-h-screen:calc(100vh - 4rem) flex-col items-center justify-start">
      <PageHeader className="w-full p-4 2xl:p-12">
        <PageHeaderHeading>Calendar date picker component</PageHeaderHeading>
        <PageHeaderDescription>assembled with shadcn/ui</PageHeaderDescription>
      </PageHeader>
      <Card className="w-full max-w-xl p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
              <FormField
                control={form.control}
                name="calendar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>1. Date Range</FormLabel>
                    <FormControl>
                      <CalendarDatePicker
                        date={field.value}
                        onDateSelect={({ from, to }) => {
                          form.setValue("calendar", { from, to });
                        }}
                        variant="ghost"
                      />
                    </FormControl>
                    <FormDescription>
                      Select a date range from the calendar
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="datePicker"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2. Single Date</FormLabel>
                    <FormControl>
                      <CalendarDatePicker
                        date={field.value}
                        onDateSelect={({ from, to }) => {
                          form.setValue("datePicker", { from, to });
                        }}
                        variant="ghost"
                        numberOfMonths={1}
                        className="w-[250px]"
                      />
                    </FormControl>
                    <FormDescription>
                      Select a date from the date picker
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button variant="outline" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </Card>
    </main>
  );
}
