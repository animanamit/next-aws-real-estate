"use client";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { mockApplications, mockResidences, mockFavorites, mockUsers } from "@/lib/mock-users";
import { properties } from "@/lib/mock-data";
import { Building, FileText, Heart, Search, Clock, CheckCircle, XCircle, Calendar, DollarSign, MapPin } from "lucide-react";
import Link from "next/link";

export default function TenantDashboard() {
  // Use the first tenant user
  const currentUser = mockUsers.find((u) => u.role === "tenant")?.id || "user-001";

  // Get tenant's applications (expanded data)
  const applications = mockApplications.filter((app) => app.tenantId === currentUser);

  // Get tenant's residences
  const residences = mockResidences.filter((res) => res.tenantId === currentUser);

  // Get tenant's favorites (expanded)
  const userFavorites = mockFavorites[currentUser] || [];
  const favorites = properties.filter((prop) => userFavorites.includes(prop.id));

  // Mock recent activity
  const recentActivity = [
    { type: "application", message: "Application approved for Sunset Apartments", time: "2 hours ago", status: "approved" },
    { type: "favorite", message: "Added Modern Loft Downtown to favorites", time: "1 day ago", status: "neutral" },
    { type: "application", message: "Application submitted for City View Towers", time: "3 days ago", status: "pending" },
    { type: "payment", message: "Rent payment processed for $2,500", time: "1 week ago", status: "completed" },
    { type: "maintenance", message: "Maintenance request completed", time: "2 weeks ago", status: "completed" },
  ];

  // Mock metrics
  const metrics = {
    totalSpent: 7500,
    avgRent: 2500,
    daysSearching: 45,
  };

  return (
    <DashboardLayout role="tenant">
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl text-gray-900 mb-1">Your summary</h1>
            <p className="text-gray-600 text-sm">Welcome back, Alex</p>
          </div>

          {/* Key Metrics - Financial Dashboard Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Total Spent</span>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-medium text-gray-900">${metrics.totalSpent.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">Last 6 months</div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Current Rent</span>
                <Building className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-medium text-gray-900">${metrics.avgRent.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">Monthly payment</div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Days Searching</span>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-medium text-gray-900">{metrics.daysSearching}</div>
              <div className="text-xs text-gray-500 mt-1">Active search time</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Applications Table */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Applications</h3>
                <Link href="/tenants/applications">
                  <Button variant="ghost" size="sm" className="text-sm">View all</Button>
                </Link>
              </div>
              
              <div className="space-y-3">
                {applications.length > 0 ? (
                  applications.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          app.status === "approved" ? "bg-green-500" : 
                          app.status === "denied" ? "bg-red-500" : "bg-yellow-500"
                        }`} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{app.propertyTitle}</div>
                          <div className="text-xs text-gray-500">{app.submittedAt}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-900 capitalize">{app.status}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No applications yet</p>
                    <Link href="/search">
                      <Button size="sm" className="mt-2">Browse Properties</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Favorites */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Saved Properties</h3>
                <Link href="/tenants/favorites">
                  <Button variant="ghost" size="sm" className="text-sm">View all</Button>
                </Link>
              </div>
              
              <div className="space-y-3">
                {favorites.length > 0 ? (
                  favorites.slice(0, 5).map((property) => (
                    <div key={property.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <Heart className="h-4 w-4 text-red-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{property.title}</div>
                          <div className="text-xs text-gray-500">{property.location.city}, {property.location.state}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">${property.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">/month</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No saved properties</p>
                    <Link href="/search">
                      <Button size="sm" className="mt-2">Browse Properties</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 py-2">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === "approved" || activity.status === "completed" ? "bg-green-500" : 
                    activity.status === "pending" ? "bg-yellow-500" : "bg-blue-500"
                  }`} />
                  <div className="flex-1">
                    <div className="text-sm text-gray-900">{activity.message}</div>
                    <div className="text-xs text-gray-500">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
