"use client";

import * as z from "zod";
import { Code } from "lucide-react";
import { Heading } from "@/components/heading";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChatCompletionRequestMessage } from "openai";
import { useState } from "react";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import ReactMarkdown from "react-markdown";
import React, { ReactNode } from "react";
import { useProModal } from "@/hooks/use-pro-modal";


interface CodeBlockProps {
  children: Array<string> | ReactNode ;
}

const CodeBlock = ({ children }:CodeBlockProps) => {
  const proModal=useProModal();
  const [isClicked, setIsClicked] = useState(false);
  const [message, setMessage] = useState("");

  const handleCopy = async (codeContent:Array<string>) => {
    const text=codeContent[0].props.children[0];
    try {
      await navigator.clipboard.writeText(text);
      setIsClicked(true);
      setMessage("Copied to clipboard!");
      setTimeout(() => {
        setIsClicked(false);
      }, 3000);
    } catch (error) {
      setIsClicked(true);
      setMessage("Failed to copy code");
      setTimeout(() => {
        setIsClicked(false);
      }, 3000);
      console.error("Copy to clipboard failed:", error);
    }
  };

  return (
    <div className="relative">
      {isClicked && <div className="text-white">{message}</div>}
      <button
        onClick={()=>handleCopy(children)}
        className="absolute right-2 top-2  bg-white dark:bg-black  p-1 text-xs rounded border border-gray-300 focus:outline-none"
      >
        {isClicked ? "Copied!" : "Copy"}
      </button>
      <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
        <pre>
          <code className="bg-black/10 rounded-lg p-1">{children}</code>
        </pre>
      </div>
    </div>
  );
};


const CodePage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      const response = await axios.post("/api/code", {
        messages: newMessages,
      });

      setMessages((current) => [...current, response.data, userMessage]);
      console.log(setMessages);
      form.reset();
    } catch (error: any) {
      if(error?.response?.status===403){
        proModal.onOpen();
      }
      //TODo Open Pro Model
      console.log(error);
    } finally {
      router.refresh();
    }
  };
  return (
    <div>
      <Heading
        title="Code Generation"
        description="Generate Code Using Descriptive Text"
        icon={Code}
        iconColor="text-red-700"
        bgColor="bg-red-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-witin:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent "
                        disabled={isLoading}
                        placeholder="eg: Simple toggle button using react hooks?"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No Conversation Started" />
          )}
          <div className="flex flex-col-reverse gap-y-4 ">
            {messages.map((message) => (
              <div
                key={message.content}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg",
                  message.role === "user"
                    ? "bg-white dark:bg-black border border-black/10"
                    : "bg-muted"
                )}
              >
                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                
                {/* <ReactMarkdown 
                 components={{
                  pre : ({node , ...props} :{node:any})=>(
                    <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                    <pre {...props}/>
                    </div>
                  ),
                    code:({node , ...props}:{node:any})=>(
                      <code className="bg-black/10 rounded-lg p-1" {...props}/>
                    )
                 }}
                 className="text-sm overflow-hidden leading-7"
                >
                  {message.content || ""}
                </ReactMarkdown> */}
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => <CodeBlock {...props} />,
                    code: ({ node, ...props }) => (
                      <code className="bg-black/10 rounded-lg p-1" {...props} />
                    ),
                  }}
                  className="text-sm overflow-hidden leading-7"
                >
                  {message.content || ""}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CodePage;
