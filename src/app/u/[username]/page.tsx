"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { Content } from "@radix-ui/react-alert-dialog";

const MessagePage = () => {
  const params = useParams();
  const { username } = params;
  const { toast } = useToast();
  const [isAcceptingMessage, setIsAcceptingMessage] = useState<any>(false);

  const { data: session } = useSession();

  const fetchAcceptMessage = useCallback(async () => {
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-messages`);
      setIsAcceptingMessage(response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessage();
  }, [session, fetchAcceptMessage]);

  //zod implementation
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const { setValue } = form;

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    if (!isAcceptingMessage) {
      toast({
        title: "Error",
        description: `${username} is not accepting messages at the moment`,
        variant: "destructive",
      });
    }

    try {
      const response = await axios.post<ApiResponse>(`/api/send-message`, {
        username: username,
        content: data.content,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setValue("content", "");
    }
  };
  return (
    <>
      <main className="flex-grow flex flex-col items-left justify-center px-4 md:px-24 py-12">
        <section className=" mb-8 md:mb-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="content"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please enter your message here..."
                        className="resize-none w-3/4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Send</Button>
            </form>
          </Form>
        </section>
      </main>
      <footer className="text-center p-4 md:p-6">
        @ 2025 Mystery Message. All rights reserved.
      </footer>
    </>
  );
};

export default MessagePage;
