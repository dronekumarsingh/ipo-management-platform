import { type NextRequest, NextResponse } from "next/server"
import { getIPOById } from "@/lib/data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ipo = getIPOById(params.id)

    if (!ipo) {
      return NextResponse.json({ success: false, error: "IPO not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: ipo,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch IPO details" }, { status: 500 })
  }
}
