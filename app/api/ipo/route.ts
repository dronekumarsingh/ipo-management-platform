import { type NextRequest, NextResponse } from "next/server"
import { getIPOs } from "@/lib/data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || undefined
    const search = searchParams.get("search") || undefined
    const sort = searchParams.get("sort") || "company_name"
    const order = searchParams.get("order") || "asc"

    const ipos = getIPOs(status, search)

    // Sort IPOs
    ipos.sort((a, b) => {
      let aValue: any = a[sort as keyof typeof a]
      let bValue: any = b[sort as keyof typeof b]

      if (sort === "open_date" || sort === "close_date" || sort === "listing_date") {
        aValue = new Date(aValue || 0)
        bValue = new Date(bValue || 0)
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (order === "desc") {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    })

    return NextResponse.json({
      success: true,
      data: ipos,
      count: ipos.length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch IPOs" }, { status: 500 })
  }
}
