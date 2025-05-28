"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { mockUsers } from "@/lib/mock-users"
import { Loader2, User, Shield, Bell, Camera, Eye, Lock } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
  companyName: z.string().optional(),
  licenseNumber: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function ManagerSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { currentUser } = useSelector((state: RootState) => state.auth)
  const user = mockUsers.find((u) => u.id === currentUser)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      bio: user?.bio || "",
      companyName: "RentEase Properties",
      licenseNumber: "LIC-12345-PM",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    setSuccess(false)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Updated profile:", data)
    setIsLoading(false)
    setSuccess(true)

    // Reset success message after 3 seconds
    setTimeout(() => {
      setSuccess(false)
    }, 3000)
  }

  const quickActions = [
    { icon: <Lock className="h-4 w-4" />, label: "Change Password", desc: "Update account password" },
    { icon: <Shield className="h-4 w-4" />, label: "2FA Setup", desc: "Enable two-factor authentication" },
    { icon: <Bell className="h-4 w-4" />, label: "Notifications", desc: "Manage notification preferences" },
    { icon: <Eye className="h-4 w-4" />, label: "Privacy", desc: "Control data visibility" },
  ]

  const stats = [
    { label: "Properties Listed", value: "12" },
    { label: "Active Applications", value: "8" },
    { label: "Account Age", value: "2 years" },
    { label: "Profile Completion", value: "85%" },
  ]

  return (
    <DashboardLayout role="manager">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-space font-semibold text-xl text-soft-black">Account Settings</h1>
            <p className="text-sm text-warm-grey mt-0.5">Manage your profile and account preferences</p>
          </div>
          {success && (
            <div className="bg-coral-accent/10 text-muted-red px-3 py-1.5 rounded text-sm">
              Profile updated successfully
            </div>
          )}
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Profile Stats */}
          <div className="col-span-12">
            <div className="grid grid-cols-4 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-pure-white p-3 rounded">
                  <div className="text-lg font-space font-semibold text-soft-black">{stat.value}</div>
                  <div className="text-xs text-warm-grey mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Form */}
          <div className="col-span-8">
            <div className="bg-pure-white rounded p-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-4 w-4 text-muted-red" />
                <h2 className="font-space font-medium text-soft-black">Profile Information</h2>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-charcoal-grey">Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-platinum-light border-0 h-8 text-sm" />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-charcoal-grey">Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} className="bg-platinum-light border-0 h-8 text-sm" />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-charcoal-grey">Phone</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-platinum-light border-0 h-8 text-sm" />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-medium text-charcoal-grey">Company</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-platinum-light border-0 h-8 text-sm" />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-charcoal-grey">Business Address</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-platinum-light border-0 h-8 text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="licenseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-charcoal-grey">License Number</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-platinum-light border-0 h-8 text-sm" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-charcoal-grey">Professional Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="bg-platinum-light border-0 resize-none text-sm"
                            rows={3}
                            placeholder="Professional background and property management experience"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      className="bg-muted-red hover:bg-coral-accent text-pure-white h-8 px-4 text-sm"
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save Changes"}
                    </Button>
                    <Button type="button" variant="outline" className="h-8 px-4 text-sm">
                      Reset
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-4 space-y-3">
            {/* Profile Picture */}
            <div className="bg-pure-white rounded p-4">
              <div className="flex items-center gap-2 mb-3">
                <Camera className="h-4 w-4 text-muted-red" />
                <h3 className="font-space font-medium text-soft-black text-sm">Profile Picture</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded overflow-hidden bg-platinum-light">
                  <img
                    src={user?.avatar || "/placeholder.svg"}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button variant="outline" className="h-7 px-3 text-xs flex-1">
                  Upload
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-pure-white rounded p-4">
              <h3 className="font-space font-medium text-soft-black text-sm mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <div
                    key={action.label}
                    className="flex items-center justify-between p-2 hover:bg-platinum-light rounded cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-muted-red">{action.icon}</div>
                      <div>
                        <div className="text-xs font-medium text-soft-black">{action.label}</div>
                        <div className="text-xs text-warm-grey">{action.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-pure-white rounded p-4">
              <h3 className="font-space font-medium text-soft-black text-sm mb-3">Account Details</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-warm-grey">Member Since</span>
                  <span className="text-soft-black font-medium">Jan 2022</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-grey">Account Type</span>
                  <span className="text-soft-black font-medium">Manager</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-grey">Last Login</span>
                  <span className="text-soft-black font-medium">Today, 9:45 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-grey">Verification</span>
                  <span className="text-muted-red font-medium">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}