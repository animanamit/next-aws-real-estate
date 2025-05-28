"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  mockApplications,
  mockManagedProperties,
  mockUsers,
} from "@/lib/mock-users";
import { properties } from "@/lib/mock-data";
import type { MockManagedProperties } from "@/types";
import { Building, FileText, DollarSign, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export default function ManagerDashboard() {
  // Use the first manager user
  const currentUser =
    mockUsers.find((u) => u.role === "manager")?.id || "user-002";

  // Get manager's properties
  const propertyIds = (mockManagedProperties as MockManagedProperties)[currentUser] || [];
  // Convert string IDs like "prop-001" to numbers like 1
  const numericPropertyIds = propertyIds.map(id => parseInt(id.replace("prop-", "").replace(/^0+/, "")));
  const managedProperties = properties.filter((prop) =>
    numericPropertyIds.includes(prop.id)
  );

  // Get applications for manager's properties
  const applications = mockApplications.filter((app) =>
    propertyIds.includes(app.propertyId)
  );

  // Count pending applications
  const pendingApplications = applications.filter(
    (app) => app.status === "pending"
  ).length;

  // Mock financial metrics
  const metrics = {
    monthlyRevenue: 24500,
    totalRevenue: 147000,
    avgOccupancy: 94,
    avgRent: 2450,
  };

  // Mock recent transactions
  const recentTransactions = [
    { type: "rent", tenant: "Sarah Johnson", property: "Downtown Loft", amount: 2800, date: "Today", status: "completed" },
    { type: "rent", tenant: "Mike Chen", property: "Sunset Apartments", amount: 2200, date: "Yesterday", status: "completed" },
    { type: "deposit", tenant: "Emma Wilson", property: "Garden View", amount: 1500, date: "2 days ago", status: "completed" },
    { type: "rent", tenant: "Alex Rodriguez", property: "City Heights", amount: 2600, date: "3 days ago", status: "pending" },
    { type: "maintenance", vendor: "Fix-It Pro", property: "Downtown Loft", amount: -450, date: "1 week ago", status: "completed" },
  ];

  // Mock property performance
  const propertyPerformance = managedProperties.slice(0, 5).map(property => ({
    ...property,
    occupancy: Math.floor(Math.random() * 20) + 80, // 80-100%
    monthlyRevenue: property.price * (Math.random() * 0.3 + 0.8), // 80-110% of rent
    applications: Math.floor(Math.random() * 8) + 2, // 2-10 applications
  }));

  return (
    <DashboardLayout role="manager">
      <div className="min-h-screen bg-gray-50">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl text-gray-900 mb-1">Property Management</h1>
            <p className="text-gray-600 text-sm">Welcome back, John</p>
          </div>

          {/* Key Metrics - Financial Dashboard Style */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Monthly Revenue</span>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-medium text-gray-900">${metrics.monthlyRevenue.toLocaleString()}</div>
              <div className="text-xs text-green-600 mt-1">+12% from last month</div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Properties</span>
                <Building className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-medium text-gray-900">{managedProperties.length}</div>
              <div className="text-xs text-gray-500 mt-1">Active listings</div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Occupancy Rate</span>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-medium text-gray-900">{metrics.avgOccupancy}%</div>
              <div className="text-xs text-green-600 mt-1">+3% this quarter</div>
            </div>

            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Pending Reviews</span>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
              <div className="text-2xl font-medium text-gray-900">{pendingApplications}</div>
              <div className="text-xs text-yellow-600 mt-1">Require attention</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
                <Button variant="ghost" size="sm" className="text-sm">View all</Button>
              </div>
              
              <div className="space-y-3">
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        transaction.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                      }`} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.type === "rent" ? "Rent Payment" : 
                           transaction.type === "deposit" ? "Security Deposit" : "Maintenance"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.tenant || transaction.vendor} • {transaction.property}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        transaction.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">{transaction.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Applications */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Applications</h3>
                <Link href="/managers/applications">
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
                          <div className="text-sm font-medium text-gray-900">{app.tenantName}</div>
                          <div className="text-xs text-gray-500">{app.propertyTitle}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-900 capitalize">{app.status}</div>
                        <div className="text-xs text-gray-500">{app.appliedAt}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No applications yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Property Performance */}
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Property Performance</h3>
            <div className="space-y-3">
              {propertyPerformance.map((property) => (
                <div key={property.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-4">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{property.title}</div>
                      <div className="text-xs text-gray-500">{property.location.city}, {property.location.state}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="text-center">
                      <div className="text-gray-900 font-medium">{property.occupancy}%</div>
                      <div className="text-xs text-gray-500">Occupancy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-900 font-medium">${Math.round(property.monthlyRevenue).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-900 font-medium">{property.applications}</div>
                      <div className="text-xs text-gray-500">Applications</div>
                    </div>
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
