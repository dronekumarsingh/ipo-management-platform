import type { IPO } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, TrendingDown, Download } from "lucide-react"
import Link from "next/link"

interface IPOCardProps {
  ipo: IPO
}

export function IPOCard({ ipo }: IPOCardProps) {
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
      month: "short",
      year: "numeric",
    })
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={ipo.logo || "/placeholder.svg"}
              alt={`${ipo.company_name} logo`}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold text-lg">{ipo.company_name}</h3>
              <p className="text-sm text-muted-foreground">{ipo.issue_type}</p>
            </div>
          </div>
          <Badge className={getStatusColor(ipo.status)}>
            {ipo.status.charAt(0).toUpperCase() + ipo.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Price Band</p>
            <p className="font-medium">{ipo.price_band}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Issue Size</p>
            <p className="font-medium">{ipo.issue_size}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {formatDate(ipo.open_date)} - {formatDate(ipo.close_date)}
          </span>
        </div>

        {ipo.status === "listed" && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Listing Gain</p>
              <div className="flex items-center gap-1">
                {(ipo.listing_gain || 0) >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`font-medium ${(ipo.listing_gain || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {ipo.listing_gain?.toFixed(2)}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Current Return</p>
              <div className="flex items-center gap-1">
                {(ipo.current_return || 0) >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`font-medium ${(ipo.current_return || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {ipo.current_return?.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
            <Link href={`/ipo/${ipo.id}`}>View Details</Link>
          </Button>
          {ipo.rhp_pdf && (
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              RHP
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
