"use client";

import { z } from "zod";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { registerSchema } from "../schemas";
import { useRegister } from "../api/use-register";
import { signUpWithGithub, signUpWithGoogle } from "@/lib/oauth";

export const SignUpCard = () => {
  const { mutate, isPending } = useRegister();
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (value: z.infer<typeof registerSchema>) => {
    mutate({ json: value });
  };

  return (
    <div className="w-full max-w-[440px] bg-[#121216] border border-white/[0.08] rounded-2xl shadow-2xl p-7 space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-white">Create Account</h2>
        <p className="text-xs text-[#A1A1AA]">Join Kinetix workspace & engineering telemetry</p>
      </div>

      <div className="h-px bg-white/[0.08] w-full" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    required
                    {...field}
                    placeholder="Full name"
                    disabled={isPending}
                    className="h-10 bg-[#18181B] border border-white/[0.1] text-white placeholder:text-[#71717A] rounded-xl focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
                  />
                </FormControl>
                <FormMessage className="text-xs text-rose-400" />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter work email"
                    disabled={isPending}
                    className="h-10 bg-[#18181B] border border-white/[0.1] text-white placeholder:text-[#71717A] rounded-xl focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
                  />
                </FormControl>
                <FormMessage className="text-xs text-rose-400" />
              </FormItem>
            )}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="password"
                    required
                    {...field}
                    placeholder="Enter password (min 8 characters)"
                    disabled={isPending}
                    min={8}
                    max={256}
                    className="h-10 bg-[#18181B] border border-white/[0.1] text-white placeholder:text-[#71717A] rounded-xl focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1]"
                  />
                </FormControl>
                <FormMessage className="text-xs text-rose-400" />
              </FormItem>
            )}
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-10 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-semibold shadow-[0_0_15px_rgba(99,102,241,0.35)] hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          >
            {isPending ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </Form>

      <div className="flex items-center gap-3">
        <div className="h-px bg-white/[0.08] flex-1" />
        <span className="text-[11px] font-mono text-[#71717A] uppercase">or continue with</span>
        <div className="h-px bg-white/[0.08] flex-1" />
      </div>

      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => signUpWithGoogle()}
          disabled={isPending}
          className="w-full h-10 rounded-xl bg-[#18181B] hover:bg-[#1F1F22] border border-white/[0.08] hover:border-white/[0.16] flex items-center justify-center gap-2.5 text-xs font-medium text-white transition-all shadow-sm disabled:opacity-50"
        >
          <FcGoogle className="size-4" />
          <span>Continue with Google</span>
        </button>
        <button
          type="button"
          onClick={() => signUpWithGithub()}
          disabled={isPending}
          className="w-full h-10 rounded-xl bg-[#18181B] hover:bg-[#1F1F22] border border-white/[0.08] hover:border-white/[0.16] flex items-center justify-center gap-2.5 text-xs font-medium text-white transition-all shadow-sm disabled:opacity-50"
        >
          <FaGithub className="size-4" />
          <span>Continue with GitHub</span>
        </button>
      </div>

      <div className="h-px bg-white/[0.08] w-full" />

      <div className="text-center text-xs text-[#A1A1AA]">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-[#c0c1ff] hover:underline font-medium">
          Sign In
        </Link>
      </div>
    </div>
  );
};
