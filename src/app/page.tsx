"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button, buttonVariants } from "@/components/ui/button";
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
  PageActions,
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
});

export default function Home() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      calendar: {
        from: new Date(new Date().getFullYear(), 0, 1),
        to: new Date(),
      },
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    toast(
      `You have selected a date range: ${data.calendar.from.toDateString()} - ${data.calendar.to.toDateString()}`
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start space-y-3 p-3">
      <PageHeader>
        <PageHeaderHeading>Calendar date picker component</PageHeaderHeading>
        <PageHeaderDescription>assembled with shadcn/ui</PageHeaderDescription>
        <PageActions>
          <Link
            target="_blank"
            rel="noreferrer"
            href="https://github.com/sersavan/shadcn-calendar-component"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            <Icons.gitHub className="mr-2 h-4 w-4" />
            GitHub
          </Link>
        </PageActions>
      </PageHeader>
      <Card className="w-full max-w-2xl p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="calendar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Calendar</FormLabel>
                  <FormControl>
                    <CalendarDatePicker
                      date={field.value}
                      onDateSelect={({ from, to }) => {
                        form.setValue("calendar", {
                          from: from || new Date(),
                          to: to || new Date(),
                        });
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Select a date range from the calendar above
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="outline" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </Card>
    </main>
  );
}
