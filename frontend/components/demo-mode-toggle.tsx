"use client";

import { useState } from "react";
import { User, Building, Settings } from "lucide-react";

interface DemoModeToggleProps {
  currentRole: "tenant" | "manager";
  onRoleChange: (role: "tenant" | "manager") => void;
  isDemoMode: boolean;
  onDemoModeChange: (enabled: boolean) => void;
}

export function DemoModeToggle({ currentRole, onRoleChange, isDemoMode, onDemoModeChange }: DemoModeToggleProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Clean, minimal trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 px-3 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        Demo
        {isDemoMode && (
          <span className="px-2 py-1 bg-white text-black text-xs rounded">
            {currentRole}
          </span>
        )}
      </button>

      {/* Clean overlay modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Settings className="h-6 w-6" />
                <h2 className="text-xl font-semibold">Demo Controls</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Demo Mode Toggle */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Demo Mode</h3>
                  <button
                    onClick={() => onDemoModeChange(!isDemoMode)}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      isDemoMode ? 'bg-black' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        isDemoMode ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Switch between user roles without authentication
                </p>
              </div>

              {/* Role Selection */}
              {isDemoMode && (
                <div>
                  <h3 className="font-medium mb-3">Current Role</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onRoleChange("tenant")}
                      className={`p-4 rounded-xl text-center transition-colors ${
                        currentRole === "tenant"
                          ? 'bg-black text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <User className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Tenant</div>
                    </button>
                    
                    <button
                      onClick={() => onRoleChange("manager")}
                      className={`p-4 rounded-xl text-center transition-colors ${
                        currentRole === "manager"
                          ? 'bg-black text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <Building className="h-6 w-6 mx-auto mb-2" />
                      <div className="text-sm font-medium">Manager</div>
                    </button>
                  </div>
                </div>
              )}

              {/* Features List */}
              {isDemoMode && (
                <div>
                  <h3 className="font-medium mb-3">
                    {currentRole === "tenant" ? "Tenant Features" : "Manager Features"}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    {currentRole === "tenant" ? (
                      <>
                        <div>• Search and filter properties</div>
                        <div>• View property details</div>
                        <div>• Submit rental applications</div>
                        <div>• Manage favorite properties</div>
                        <div>• View application status</div>
                      </>
                    ) : (
                      <>
                        <div>• Manage property listings</div>
                        <div>• Create new properties</div>
                        <div>• Review tenant applications</div>
                        <div>• Approve/deny applications</div>
                        <div>• View property analytics</div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium mb-2">Demo Instructions</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Tenant:</strong> Browse properties, submit applications</div>
                  <div><strong>Manager:</strong> Manage listings, review applications</div>
                  <div className="pt-1"><strong>Tip:</strong> Submit an application as tenant, then switch to manager!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}