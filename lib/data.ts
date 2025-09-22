import type { IPO } from "./types"

// Dummy IPO data as specified in requirements
export const dummyIPOs: IPO[] = [
  {
    id: "1",
    company_name: "TechCorp Solutions",
    logo: "/abstract-tech-logo.png",
    price_band: "₹300-350",
    open_date: "2025-01-15",
    close_date: "2025-01-17",
    issue_size: "₹2,500 Cr",
    issue_type: "Book Built Issue",
    listing_date: "2025-01-22",
    status: "upcoming",
    ipo_price: 325,
    listing_price: 380,
    current_market_price: 420,
    rhp_pdf: "/docs/techcorp-rhp.pdf",
    drhp_pdf: "/docs/techcorp-drhp.pdf",
    listing_gain: 16.92,
    current_return: 29.23,
  },
  {
    id: "2",
    company_name: "GreenEnergy Ltd",
    logo: "/green-energy-company-logo.jpg",
    price_band: "₹450-500",
    open_date: "2025-01-10",
    close_date: "2025-01-12",
    issue_size: "₹1,800 Cr",
    issue_type: "Book Built Issue",
    listing_date: "2025-01-18",
    status: "ongoing",
    ipo_price: 475,
    listing_price: 520,
    current_market_price: 495,
    rhp_pdf: "/docs/greenenergy-rhp.pdf",
    drhp_pdf: "/docs/greenenergy-drhp.pdf",
    listing_gain: 9.47,
    current_return: 4.21,
  },
  {
    id: "3",
    company_name: "FinTech Innovations",
    logo: "/fintech-logo.png",
    price_band: "₹200-250",
    open_date: "2024-12-20",
    close_date: "2024-12-22",
    issue_size: "₹3,200 Cr",
    issue_type: "Book Built Issue",
    listing_date: "2024-12-28",
    status: "listed",
    ipo_price: 225,
    listing_price: 280,
    current_market_price: 315,
    rhp_pdf: "/docs/fintech-rhp.pdf",
    drhp_pdf: "/docs/fintech-drhp.pdf",
    listing_gain: 24.44,
    current_return: 40.0,
  },
  {
    id: "4",
    company_name: "Healthcare Plus",
    logo: "/healthcare-company-logo.png",
    price_band: "₹180-220",
    open_date: "2025-02-01",
    close_date: "2025-02-03",
    issue_size: "₹1,500 Cr",
    issue_type: "Book Built Issue",
    status: "upcoming",
    ipo_price: 200,
    rhp_pdf: "/docs/healthcare-rhp.pdf",
    drhp_pdf: "/docs/healthcare-drhp.pdf",
  },
  {
    id: "5",
    company_name: "AutoMotive Systems",
    logo: "/automotive-company-logo.png",
    price_band: "₹600-700",
    open_date: "2025-01-25",
    close_date: "2025-01-27",
    issue_size: "₹4,000 Cr",
    issue_type: "Book Built Issue",
    status: "upcoming",
    ipo_price: 650,
    rhp_pdf: "/docs/automotive-rhp.pdf",
    drhp_pdf: "/docs/automotive-drhp.pdf",
  },
]

export function getIPOs(status?: string, search?: string): IPO[] {
  let filteredIPOs = dummyIPOs

  if (status && status !== "all") {
    filteredIPOs = filteredIPOs.filter((ipo) => ipo.status === status)
  }

  if (search) {
    filteredIPOs = filteredIPOs.filter((ipo) => ipo.company_name.toLowerCase().includes(search.toLowerCase()))
  }

  return filteredIPOs
}

export function getIPOById(id: string): IPO | undefined {
  return dummyIPOs.find((ipo) => ipo.id === id)
}
