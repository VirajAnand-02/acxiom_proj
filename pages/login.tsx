import { zodResolver } from "@hookform/resolvers/zod";
import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { FormInput } from "@/components/FormInput";
import { authOptions } from "@/lib/auth";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  return (
    <section className="mx-auto max-w-md space-y-4 rounded border bg-white p-4">
      <h1 className="text-xl font-semibold">Login</h1>
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit(async (values) => {
          const response = await signIn("credentials", {
            ...values,
            redirect: false
          });

          if (response?.ok) {
            toast.success("Logged in");
            window.location.href = "/dashboard";
            return;
          }

          toast.error("Invalid email or password");
        })}
      >
        <FormInput id="email" label="Email" type="email" autoComplete="email" error={form.formState.errors.email?.message} {...form.register("email")} />
        <div className="space-y-1">
          <FormInput
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />
          <button type="button" className="text-xs text-slate-700 underline" onClick={() => setShowPassword((value) => !value)}>
            {showPassword ? "Hide password" : "Show password"}
          </button>
        </div>
        <button type="submit" className="w-full rounded bg-slate-900 px-4 py-2 text-sm text-white">
          Sign In
        </button>
      </form>
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false
      }
    };
  }
  return { props: {} };
};
