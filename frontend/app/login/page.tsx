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
import { Loader2, Home, User, Building } from "lucide-react"
import Link from "next/link"

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type FormValues = z.infer<typeof formSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    setError(null)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, always succeed
    if (data.email.includes("tenant")) {
      router.push("/tenants/dashboard")
    } else {
      router.push("/managers/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-muted-red to-coral-accent flex flex-col">
      <header className="bg-muted-red text-pure-white py-4 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-pure-white rounded-lg group-hover:bg-light-yellow transition-colors">
              <Home className="h-5 w-5 text-muted-red" />
            </div>
            <span className="font-medium text-xl text-pure-white tracking-tight">RentEase</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-2 border-light-yellow">
          <CardHeader className="space-y-1 bg-muted-red text-pure-white">
            <CardTitle className="text-2xl font-medium text-center tracking-tight">Sign In</CardTitle>
            <CardDescription className="text-center text-pure-white/80">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 bg-linear-to-b from-muted-red/5 to-pure-white">
            {error && (
              <div className="bg-muted-red/10 border-2 border-muted-red text-muted-red px-4 py-2 rounded-md mb-4">
                {error}
              </div>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-charcoal-grey font-medium">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your.email@example.com"
                          type="email"
                          {...field}
                          className="border-platinum-silver focus:border-muted-red"
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
                      <FormLabel className="text-charcoal-grey font-medium">Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          {...field}
                          className="border-platinum-silver focus:border-muted-red font-space"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-muted-red hover:bg-coral-accent text-pure-white font-medium tracking-tight"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 pt-6 border-t border-platinum-silver">
              <h3 className="text-center text-muted-red font-medium mb-4 tracking-tight">Demo Access</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="border-muted-red text-muted-red hover:bg-muted-red hover:text-pure-white flex items-center justify-center font-medium tracking-tight"
                  onClick={() => router.push("/tenants/dashboard")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Tenant Dashboard
                </Button>
                <Button
                  variant="outline"
                  className="border-muted-red text-muted-red hover:bg-muted-red hover:text-pure-white flex items-center justify-center font-medium tracking-tight"
                  onClick={() => router.push("/managers/dashboard")}
                >
                  <Building className="h-4 w-4 mr-2" />
                  Manager Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 bg-light-yellow/30">
            <div className="text-center text-sm text-charcoal-grey">
              <Link href="#" className="text-muted-red hover:text-coral-accent font-medium">
                Forgot your password?
              </Link>
            </div>
            <div className="text-center text-sm text-charcoal-grey">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-muted-red hover:text-coral-accent font-medium">
                Sign Up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
