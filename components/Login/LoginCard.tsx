"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaGithub } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TfiEmail } from "react-icons/tfi";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
// const [loading, setLoading] = useState(false);

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Entering your e-mail is required!" })
    .regex(emailRegex, { message: "Invalid email address!" }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters" })
    .regex(passwordRegex, {
      message:
        "Your password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
    }),
});

function Login() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const { email, password } = values;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // console.log(data, "data", error, "error");

      if (error) throw error;
      toast({
        title: "login successful",
      });

      router.push("/todo");
    } catch (error) {
      console.error("error", error);
      toast({
        title: "failed",
        description: "Login information is incorrect",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full px-3">
      <h2 className="flex flex-col items-center justify-center m-5 font-bold text-2xl">
        Sign in to your account
      </h2>

      <div className="bg-white rounded-lg px-4 py-3 shadow-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input placeholder="Enter your email" {...field} />
                      <div className="absolute right-0 pr-3 cursor-pointer text-primary">
                        <TfiEmail />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs max-w-full" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <Input
                        className="focus-visible:ring-0 pr-8"
                        type={isVisible ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                      <div
                        className="absolute right-0 pr-3 cursor-pointer text-primary"
                        onClick={() => setIsVisible(!isVisible)}
                      >
                        {isVisible ? <FaEyeSlash /> : <FaEye />}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs max-w-full" />
                </FormItem>
              )}
            />
            <div className="text-xs text-end opacity-70">
              <Link href={"#"}>Forget your password?</Link>
            </div>
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Signin..." : "Sign in"}
            </Button>
            <div className="text-xs text-center opacity-70 mt-0">
              <Link href={"/signup"}>Don't you have an account?</Link>
            </div>
          </form>
        </Form>

        <div className="flex mt-3 items-center gap-2">
          <div className="border border-gray-300 w-full" />
          <div className="opacity-70 text-xs text-nowrap">or continue with</div>
          <div className="border border-gray-300 w-full" />
        </div>
        <div className="mt-6 flex max-md:flex-col w-full items-center gap-4">
          <Button className="w-full flex gap-2" variant="outline">
            <FcGoogle />
            Login with Google
          </Button>

          <Button className="w-full flex gap-2" variant="outline">
            <FaGithub />
            Login with GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
