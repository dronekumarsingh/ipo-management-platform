export interface IPO {
  id: string
  company_name: string
  logo: string
  price_band: string
  open_date: string
  close_date: string
  issue_size: string
  issue_type: string
  listing_date?: string
  status: "upcoming" | "ongoing" | "listed"
  ipo_price?: number
  listing_price?: number
  current_market_price?: number
  rhp_pdf?: string
  drhp_pdf?: string
  listing_gain?: number
  current_return?: number
}

export interface IPOFormData {
  company_name: string
  logo: File | null
  price_band: string
  open_date: string
  close_date: string
  issue_size: string
  issue_type: string
  listing_date?: string
  status: "upcoming" | "ongoing" | "listed"
  ipo_price?: number
  listing_price?: number
  current_market_price?: number
  rhp_pdf?: File | null
  drhp_pdf?: File | null
}
