"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { any } from "zod";
import { LuListTodo } from "react-icons/lu";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { postTodo } from "@/data/actions/todoAction";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  todoInput: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

function TodoCreate() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      todoInput: "",
    },
  });

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    await postTodo(data.todoInput);
    try {
      toast({
        title: "successful",
        description: "New todo value added",
      });
      router.refresh();
      form.reset();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-full flex justify-center items-center flex-col ">
          <div className="text-center my-4 flex items-center justify-center gap-3">
            <h1 className="text-xl font-semibold ">To Do List</h1>
            <LuListTodo className="text-2xl font-bold" />
          </div>
          <div className="flex items-center w-full relative">
            <FormField
              control={form.control}
              name="todoInput"
              render={({ field }) => (
                <>
                  <Input
                    className="border-none border-b border-light-gray outline-none focus-visible:ring-0 shadow-lg rounded-full"
                    type="text"
                    placeholder="Add new task"
                    {...field}
                  />
                  <FormMessage />
                </>
              )}
            />

            <div className="absolute right-0 ">
              <Button className="rounded-full bg-primary">Add</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default TodoCreate;
