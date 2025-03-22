import type React from "react"
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper"
import Nav from "@/components/dashboard/nav"
import { Toaster } from "@/components/ui/sonner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Add space for the main navbar */}
      <div className="h-16"></div>

      {/* Dashboard navigation */}
      <div className="border-b bg-background">
        <MaxWidthWrapper>
          <div className="py-4">
            <Nav />
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Main content */}
      <MaxWidthWrapper className="flex-1 py-6">
        <main>{children}</main>
      </MaxWidthWrapper>

      <Toaster />
    </div>
  )
}

