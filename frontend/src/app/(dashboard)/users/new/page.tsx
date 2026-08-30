"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Loader2, Eye, EyeOff, Copy, CheckCircle, AlertCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "user"]),
});

export default function NewUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userCreated, setUserCreated] = useState(false);
  const [createdUserData, setCreatedUserData] = useState<any>(null);
  const [passwordCopied, setPasswordCopied] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:{
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  const generatePassword = () => {
    const randomPassword = `Tegano${Math.random().toString(36).slice(-8)}`;
    form.setValue("password", randomPassword);
    setShowPassword(true);
  };

  const copyPassword = async () => {
    const password = form.getValues("password") || createdUserData?.password;
    if (password) {
      await navigator.clipboard.writeText(password);
      setPasswordCopied(true);
      toast.success("Password copied to clipboard");
      setTimeout(() => setPasswordCopied(false), 2000);
    }
  };

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await api.post("/users", data);
      setCreatedUserData({ ...data });
      setUserCreated(true);
      toast.success("User created successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create user");
      setLoading(false);
    }
  }

  if (userCreated && createdUserData) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <CardTitle className="text-green-900">User Created Successfully!</CardTitle>
            </div>
            <CardDescription className="text-green-700">
              Save the password below. The user can change it after first login.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-green-200 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-700">Name:</p>
                <p className="text-base">{createdUserData.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Email:</p>
                <p className="text-base">{createdUserData.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Role:</p>
                <p className="text-base capitalize">{createdUserData.role}</p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm font-semibold text-gray-700 mb-2">Temporary Password:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-100 px-3 py-2 rounded border text-lg font-mono">
                    {createdUserData.password}
                  </code>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={copyPassword}
                    className="shrink-0"
                  >
                    {passwordCopied ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Save this password now! For security reasons, it won't be shown again. The user should change it after first login.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setUserCreated(false);
                  setCreatedUserData(null);
                  form.reset();
                }}
              >
                Create Another User
              </Button>
              <Button
                type="button"
                className="bg-[#2D9B4E] hover:bg-[#2D9B4E]/90"
                onClick={() => router.push("/users")}
              >
                Back to Users List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add User</h1>
        <p className="text-muted-foreground mt-1">
          Create a new staff account. They will be able to log in immediately.
        </p>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@tegano.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temporary Password</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          className="pr-10"
                          {...field} 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generatePassword}
                        className="w-full"
                      >
                        Generate Random Password
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    The user will need to change this password after first login.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Remember:</strong> After creating the user, you'll see a confirmation screen with the password. Make sure to save it because you won't see it again!
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#2D9B4E] hover:bg-[#2D9B4E]/90" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create User
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
