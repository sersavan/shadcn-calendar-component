"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

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
    <main className="flex min-h-screen items-start justify-center">
      <Card className="w-[400px] p-4 m-8">
        <CardHeader>
          <CardTitle className="text-3xl font-semibold">
            Calendar Date Picker
          </CardTitle>
          <CardDescription className="text-md text-muted-foreground">
            <span>
              assembled with shadcn/ui
              <Link
                href="https://github.com/sersavan/shadcn-calendar-component"
                target="_blank"
              >
                <Button variant="link" size="sm">
                  <GitHubLogoIcon className="h-4 w-4" />
                </Button>
              </Link>
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="calendar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md font-normal">
                        Date Range
                      </FormLabel>
                      <FormControl className="w-full">
                        <CalendarDatePicker
                          date={field.value}
                          onDateSelect={({ from, to }) => {
                            form.setValue("calendar", { from, to });
                          }}
                          variant="outline"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="datePicker"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md font-normal">
                        Single Date
                      </FormLabel>
                      <FormControl className="w-full">
                        <CalendarDatePicker
                          date={field.value}
                          onDateSelect={({ from, to }) => {
                            form.setValue("datePicker", { from, to });
                          }}
                          variant="outline"
                          numberOfMonths={1}
                          className="min-w-[250px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button variant="default" type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
