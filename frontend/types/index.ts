import type React from "react"
export interface FeatureCard {
  icon: React.ReactNode
  title: string
  description: string
}

export interface ProcessStep {
  number: string
  title: string
  description: string
  icon: React.ReactNode
}

export interface NavigationItem {
  label: string
  href: string
}
