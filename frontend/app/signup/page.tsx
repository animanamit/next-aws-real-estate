"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, Home, User, Building } from "lucide-react"
import Link from "next/link"

const formSchema = z
  .object({
    role: z.enum(["tenant", "manager"], {
      required_error: "Please select a role",
    }),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof formSchema>

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "tenant",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    setError(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo purposes, always succeed
    if (data.role === "tenant") {
      router.push("/tenants/dashboard")
    } else {
      router.push("/managers/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-platinum-silver/30 to-pure-white flex flex-col">
      <header className="bg-pure-white border-b border-platinum-silver py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-muted-red rounded-lg group-hover:bg-coral-accent transition-colors">
              <Home className="h-5 w-5 text-pure-white" />
            </div>
            <span className="font-neue font-bold text-xl text-soft-black">RentEase</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <Card className="w-full max-w-md shadow-lg border-platinum-silver">
          <CardHeader className="space-y-1 bg-platinum-silver/20">
            <CardTitle className="text-2xl font-neue font-bold text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">Sign up to start your journey with RentEase</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <div className="bg-muted-red/10 border border-muted-red text-muted-red px-4 py-2 rounded-md mb-4">
                {error}
              </div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-charcoal-grey">I am a:</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col sm:flex-row gap-4"
                        >
                          <div className="flex items-center space-x-2 border border-platinum-silver rounded-lg p-4 cursor-pointer hover:border-muted-red transition-colors flex-1 bg-platinum-silver/10">
                            <RadioGroupItem value="tenant" id="tenant" className="text-muted-red" />
                            <label
                              htmlFor="tenant"
                              className="flex items-center cursor-pointer font-medium text-soft-black"
                            >
                              <User className="h-5 w-5 mr-2 text-muted-red" />
                              Tenant
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 border border-platinum-silver rounded-lg p-4 cursor-pointer hover:border-muted-red transition-colors flex-1 bg-platinum-silver/10">
                            <RadioGroupItem value="manager" id="manager" className="text-muted-red" />
                            <label
                              htmlFor="manager"
                              className="flex items-center cursor-pointer font-medium text-soft-black"
                            >
                              <Building className="h-5 w-5 mr-2 text-muted-red" />
                              Property Manager
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-charcoal-grey">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} className="border-platinum-silver" />
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
                      <FormLabel className="text-charcoal-grey">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your.email@example.com"
                          type="email"
                          {...field}
                          className="border-platinum-silver"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-charcoal-grey">Password</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" type="password" {...field} className="border-platinum-silver" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-charcoal-grey">Confirm Password</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" type="password" {...field} className="border-platinum-silver" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-muted-red hover:bg-coral-accent text-pure-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 pt-6 border-t border-platinum-silver">
              <h3 className="text-center text-charcoal-grey font-medium mb-4">Demo Access</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="border-muted-red text-muted-red hover:bg-muted-red hover:text-pure-white flex items-center justify-center"
                  onClick={() => router.push("/tenants/dashboard")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Tenant Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="border-muted-red text-muted-red hover:bg-muted-red hover:text-pure-white flex items-center justify-center"
                  onClick={() => router.push("/managers/dashboard")}
                >
                  <Building className="h-4 w-4 mr-2" />
                  Manager Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center bg-platinum-silver/10">
            <div className="text-center text-sm text-warm-grey">
              Already have an account?{" "}
              <Link href="/login" className="text-muted-red hover:text-coral-accent">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
