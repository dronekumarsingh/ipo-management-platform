"use client"

import { useState, useEffect } from "react"
import type { IPO } from "@/lib/types"
import { IPOCard } from "@/components/ipo-card"
import { SearchFilters } from "@/components/search-filters"
import { IPOStats } from "@/components/ipo-stats"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Building2, Shield, Clock, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [ipos, setIpos] = useState<IPO[]>([])
  const [filteredIPOs, setFilteredIPOs] = useState<IPO[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("company_name")

  useEffect(() => {
    fetchIPOs()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [ipos, statusFilter, searchTerm, sortBy])

  const fetchIPOs = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/ipo")
      const data = await response.json()

      if (data.success) {
        setIpos(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch IPOs:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...ipos]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((ipo) => ipo.status === statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((ipo) => ipo.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a]
      let bValue: any = b[sortBy as keyof typeof b]

      if (sortBy === "open_date" || sortBy === "close_date" || sortBy === "listing_date") {
        aValue = new Date(aValue || 0)
        bValue = new Date(bValue || 0)
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    })

    setFilteredIPOs(filtered)
  }

  const getStatusCounts = () => {
    const upcoming = ipos.filter((ipo) => ipo.status === "upcoming").length
    const ongoing = ipos.filter((ipo) => ipo.status === "ongoing").length
    const listed = ipos.filter((ipo) => ipo.status === "listed").length
    return { upcoming, ongoing, listed }
  }

  const getTopPerformers = () => {
    return ipos
      .filter((ipo) => ipo.status === "listed" && ipo.current_return)
      .sort((a, b) => (b.current_return || 0) - (a.current_return || 0))
      .slice(0, 3)
  }

  const { upcoming, ongoing, listed } = getStatusCounts()
  const topPerformers = getTopPerformers()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">IPO Central</h1>
                <p className="text-sm text-muted-foreground">Professional IPO Tracking Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild>
                <Link href="/admin">Admin Panel</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Track IPOs with Confidence
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Get comprehensive insights into Initial Public Offerings with real-time data, performance metrics, and
              detailed analysis to make informed investment decisions.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Verified Data</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Real-time Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span>Performance Analytics</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <IPOStats upcoming={upcoming} ongoing={ongoing} listed={listed} />
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <TabsList className="w-fit">
              <TabsTrigger value="all">All IPOs</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger value="listed">Listed</TabsTrigger>
            </TabsList>

            <SearchFilters
              onSearch={setSearchTerm}
              onStatusFilter={setStatusFilter}
              onSort={setSortBy}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              sortBy={sortBy}
            />
          </div>

          <TabsContent value="all" className="space-y-6">
            {/* Top Performers */}
            {topPerformers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Top Performers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {topPerformers.map((ipo, index) => (
                      <div key={ipo.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          <Badge
                            variant="secondary"
                            className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                          >
                            {index + 1}
                          </Badge>
                        </div>
                        <img
                          src={ipo.logo || "/placeholder.svg"}
                          alt={`${ipo.company_name} logo`}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{ipo.company_name}</p>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-600" />
                            <span className="text-sm font-medium text-green-600">
                              +{ipo.current_return?.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* IPO Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 bg-muted animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : filteredIPOs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIPOs.map((ipo) => (
                  <IPOCard key={ipo.id} ipo={ipo} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">No IPOs found</p>
                  <p className="text-muted-foreground">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "No IPOs are currently available"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ipos
                .filter((ipo) => ipo.status === "upcoming")
                .map((ipo) => (
                  <IPOCard key={ipo.id} ipo={ipo} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="ongoing">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ipos
                .filter((ipo) => ipo.status === "ongoing")
                .map((ipo) => (
                  <IPOCard key={ipo.id} ipo={ipo} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="listed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ipos
                .filter((ipo) => ipo.status === "listed")
                .map((ipo) => (
                  <IPOCard key={ipo.id} ipo={ipo} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold">IPO Central</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Your trusted platform for IPO tracking and analysis. Get comprehensive insights into Initial Public
                Offerings with real-time data and performance metrics.
              </p>
              <p className="text-sm text-muted-foreground">Professional IPO tracking and analysis platform</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-foreground transition-colors">
                    All IPOs
                  </Link>
                </li>
                <li>
                  <Link href="/?status=upcoming" className="hover:text-foreground transition-colors">
                    Upcoming IPOs
                  </Link>
                </li>
                <li>
                  <Link href="/?status=ongoing" className="hover:text-foreground transition-colors">
                    Ongoing IPOs
                  </Link>
                </li>
                <li>
                  <Link href="/?status=listed" className="hover:text-foreground transition-colors">
                    Listed IPOs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/admin" className="hover:text-foreground transition-colors">
                    Admin Dashboard
                  </Link>
                </li>
                <li>
                  <a href="/api/ipo" className="hover:text-foreground transition-colors">
                    API Documentation
                  </a>
                </li>
                <li>
                  <Link href="/" className="hover:text-foreground transition-colors">
                    About Platform
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">© 2025 IPO Central. All rights reserved.</p>
            <p className="text-xs text-muted-foreground mt-2">
              IPO data is for informational purposes only. Please consult with financial advisors before making
              investment decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
