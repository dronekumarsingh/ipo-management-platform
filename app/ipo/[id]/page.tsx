"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import type { IPO } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Building2, TrendingUp, TrendingDown, Download, ArrowLeft, IndianRupee } from "lucide-react"
import Link from "next/link"

export default function IPODetailPage() {
  const params = useParams()
  const [ipo, setIpo] = useState<IPO | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchIPODetails(params.id as string)
    }
  }, [params.id])

  const fetchIPODetails = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/ipo/${id}`)
      const data = await response.json()

      if (data.success) {
        setIpo(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch IPO details:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "ongoing":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "listed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48 bg-muted rounded"></div>
              <div className="h-48 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!ipo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">IPO Not Found</h1>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">IPO Details</h1>
              <p className="text-muted-foreground">Complete information about {ipo.company_name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Company Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={ipo.logo || "/placeholder.svg"}
                  alt={`${ipo.company_name} logo`}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <CardTitle className="text-2xl">{ipo.company_name}</CardTitle>
                  <p className="text-muted-foreground mt-1">{ipo.issue_type}</p>
                  <Badge className={`mt-2 ${getStatusColor(ipo.status)}`}>
                    {ipo.status.charAt(0).toUpperCase() + ipo.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Price Band</p>
                <p className="text-2xl font-bold">{ipo.price_band}</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* IPO Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                IPO Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Issue Size</p>
                  <p className="font-semibold">{ipo.issue_size}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Issue Type</p>
                  <p className="font-semibold">{ipo.issue_type}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Opening Date</p>
                    <p className="font-semibold">{formatDate(ipo.open_date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Closing Date</p>
                    <p className="font-semibold">{formatDate(ipo.close_date)}</p>
                  </div>
                </div>

                {ipo.listing_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Listing Date</p>
                      <p className="font-semibold">{formatDate(ipo.listing_date)}</p>
                    </div>
                  </div>
                )}
              </div>

              {ipo.ipo_price && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">IPO Price</p>
                    <p className="text-xl font-bold flex items-center gap-1">
                      <IndianRupee className="w-5 h-5" />
                      {ipo.ipo_price}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          {ipo.status === "listed" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ipo.listing_price && (
                  <div>
                    <p className="text-sm text-muted-foreground">Listing Price</p>
                    <p className="text-xl font-semibold">{formatCurrency(ipo.listing_price)}</p>
                  </div>
                )}

                {ipo.current_market_price && (
                  <div>
                    <p className="text-sm text-muted-foreground">Current Market Price</p>
                    <p className="text-xl font-semibold">{formatCurrency(ipo.current_market_price)}</p>
                  </div>
                )}

                <Separator />

                {ipo.listing_gain !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Listing Gain</p>
                      <div className="flex items-center gap-2">
                        {ipo.listing_gain >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span
                          className={`text-lg font-bold ${ipo.listing_gain >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {ipo.listing_gain.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {ipo.current_return !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Return</p>
                      <div className="flex items-center gap-2">
                        {ipo.current_return >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span
                          className={`text-lg font-bold ${ipo.current_return >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {ipo.current_return.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ipo.rhp_pdf && (
                  <Button variant="outline" className="h-auto p-4 justify-start bg-transparent">
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-semibold">Red Herring Prospectus (RHP)</p>
                        <p className="text-sm text-muted-foreground">Download RHP document</p>
                      </div>
                    </div>
                  </Button>
                )}

                {ipo.drhp_pdf && (
                  <Button variant="outline" className="h-auto p-4 justify-start bg-transparent">
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-semibold">Draft Red Herring Prospectus (DRHP)</p>
                        <p className="text-sm text-muted-foreground">Download DRHP document</p>
                      </div>
                    </div>
                  </Button>
                )}
              </div>

              {!ipo.rhp_pdf && !ipo.drhp_pdf && (
                <p className="text-muted-foreground text-center py-8">No documents available for this IPO yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
