import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Calendar, Building2, IndianRupee } from "lucide-react"

interface IPOStatsProps {
  upcoming: number
  ongoing: number
  listed: number
  totalIssueSize?: string
}

export function IPOStats({ upcoming, ongoing, listed, totalIssueSize }: IPOStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Upcoming IPOs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{upcoming}</div>
          <p className="text-xs text-muted-foreground mt-1">Ready to launch</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Ongoing IPOs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{ongoing}</div>
          <p className="text-xs text-muted-foreground mt-1">Currently open</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-gray-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Listed IPOs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-600">{listed}</div>
          <p className="text-xs text-muted-foreground mt-1">Successfully listed</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <IndianRupee className="w-4 h-4" />
            Total Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600">{totalIssueSize || "₹12,000+ Cr"}</div>
          <p className="text-xs text-muted-foreground mt-1">Combined issue size</p>
        </CardContent>
      </Card>
    </div>
  )
}
