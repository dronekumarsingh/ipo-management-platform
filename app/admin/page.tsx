"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { IPO } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUpload } from "@/components/file-upload"
import { Plus, Edit, Trash2, Eye, LogOut, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [ipos, setIpos] = useState<IPO[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIPO, setEditingIPO] = useState<IPO | null>(null)
  const [formData, setFormData] = useState({
    company_name: "",
    logo: "",
    price_band: "",
    open_date: "",
    close_date: "",
    issue_size: "",
    issue_type: "Book Built Issue",
    listing_date: "",
    status: "upcoming" as "upcoming" | "ongoing" | "listed",
    ipo_price: "",
    listing_price: "",
    current_market_price: "",
    rhp_pdf: "",
    drhp_pdf: "",
  })

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem("admin_authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      fetchIPOs()
    }
  }, [])

  const fetchIPOs = async () => {
    try {
      const response = await fetch("/api/ipo")
      const data = await response.json()
      if (data.success) {
        setIpos(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch IPOs:", error)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple authentication (in production, use proper authentication)
    if (loginForm.username === "admin" && loginForm.password === "admin123") {
      setIsAuthenticated(true)
      localStorage.setItem("admin_authenticated", "true")
      fetchIPOs()
    } else {
      alert("Invalid credentials. Use username: admin, password: admin123")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin_authenticated")
    setLoginForm({ username: "", password: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingIPO ? "/api/admin/ipo" : "/api/admin/ipo"
      const method = editingIPO ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingIPO ? { id: editingIPO.id, ...formData } : formData),
      })

      const data = await response.json()

      if (data.success) {
        setIsDialogOpen(false)
        setEditingIPO(null)
        resetForm()
        fetchIPOs()
        alert(editingIPO ? "IPO updated successfully!" : "IPO created successfully!")
      }
    } catch (error) {
      console.error("Failed to save IPO:", error)
      alert("Failed to save IPO")
    }
  }

  const handleEdit = (ipo: IPO) => {
    setEditingIPO(ipo)
    setFormData({
      company_name: ipo.company_name,
      logo: ipo.logo || "",
      price_band: ipo.price_band,
      open_date: ipo.open_date,
      close_date: ipo.close_date,
      issue_size: ipo.issue_size,
      issue_type: ipo.issue_type,
      listing_date: ipo.listing_date || "",
      status: ipo.status,
      ipo_price: ipo.ipo_price?.toString() || "",
      listing_price: ipo.listing_price?.toString() || "",
      current_market_price: ipo.current_market_price?.toString() || "",
      rhp_pdf: ipo.rhp_pdf || "",
      drhp_pdf: ipo.drhp_pdf || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this IPO?")) {
      try {
        const response = await fetch(`/api/admin/ipo?id=${id}`, {
          method: "DELETE",
        })

        const data = await response.json()

        if (data.success) {
          fetchIPOs()
          alert("IPO deleted successfully!")
        }
      } catch (error) {
        console.error("Failed to delete IPO:", error)
        alert("Failed to delete IPO")
      }
    }
  }

  const resetForm = () => {
    setFormData({
      company_name: "",
      logo: "",
      price_band: "",
      open_date: "",
      close_date: "",
      issue_size: "",
      issue_type: "Book Built Issue",
      listing_date: "",
      status: "upcoming",
      ipo_price: "",
      listing_price: "",
      current_market_price: "",
      rhp_pdf: "",
      drhp_pdf: "",
    })
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

  const getStats = () => {
    const upcoming = ipos.filter((ipo) => ipo.status === "upcoming").length
    const ongoing = ipos.filter((ipo) => ipo.status === "ongoing").length
    const listed = ipos.filter((ipo) => ipo.status === "listed").length
    return { upcoming, ongoing, listed, total: ipos.length }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <p className="text-sm text-muted-foreground text-center">Demo credentials: admin / admin123</p>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">IPO Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage IPO listings and data</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/">
                  <Eye className="w-4 h-4 mr-2" />
                  View Public Site
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="ipos">Manage IPOs</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total IPOs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ongoing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.ongoing}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Listed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-600">{stats.listed}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent IPOs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Recent IPOs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ipos.slice(0, 5).map((ipo) => (
                    <div key={ipo.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={ipo.logo || "/placeholder.svg"}
                          alt={`${ipo.company_name} logo`}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{ipo.company_name}</p>
                          <p className="text-sm text-muted-foreground">{ipo.price_band}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(ipo.status)}>{ipo.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ipos" className="space-y-6">
            {/* Add IPO Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">IPO Management</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingIPO(null)
                      resetForm()
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New IPO
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingIPO ? "Edit IPO" : "Add New IPO"}</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Basic Information</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="company_name">Company Name</Label>
                          <Input
                            id="company_name"
                            value={formData.company_name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, company_name: e.target.value }))}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="price_band">Price Band</Label>
                          <Input
                            id="price_band"
                            value={formData.price_band}
                            onChange={(e) => setFormData((prev) => ({ ...prev, price_band: e.target.value }))}
                            placeholder="₹300-350"
                            required
                          />
                        </div>
                      </div>

                      {/* Logo Upload */}
                      <FileUpload
                        type="logo"
                        label="Company Logo"
                        currentFile={formData.logo}
                        onUpload={(url) => setFormData((prev) => ({ ...prev, logo: url }))}
                      />
                    </div>

                    {/* IPO Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">IPO Details</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="open_date">Open Date</Label>
                          <Input
                            id="open_date"
                            type="date"
                            value={formData.open_date}
                            onChange={(e) => setFormData((prev) => ({ ...prev, open_date: e.target.value }))}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="close_date">Close Date</Label>
                          <Input
                            id="close_date"
                            type="date"
                            value={formData.close_date}
                            onChange={(e) => setFormData((prev) => ({ ...prev, close_date: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="issue_size">Issue Size</Label>
                          <Input
                            id="issue_size"
                            value={formData.issue_size}
                            onChange={(e) => setFormData((prev) => ({ ...prev, issue_size: e.target.value }))}
                            placeholder="₹2,500 Cr"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="issue_type">Issue Type</Label>
                          <Select
                            value={formData.issue_type}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, issue_type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Book Built Issue">Book Built Issue</SelectItem>
                              <SelectItem value="Fixed Price Issue">Fixed Price Issue</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value: "upcoming" | "ongoing" | "listed") =>
                              setFormData((prev) => ({ ...prev, status: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="upcoming">Upcoming</SelectItem>
                              <SelectItem value="ongoing">Ongoing</SelectItem>
                              <SelectItem value="listed">Listed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="listing_date">Listing Date (Optional)</Label>
                          <Input
                            id="listing_date"
                            type="date"
                            value={formData.listing_date}
                            onChange={(e) => setFormData((prev) => ({ ...prev, listing_date: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pricing Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Pricing Information (Optional)</h3>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="ipo_price">IPO Price</Label>
                          <Input
                            id="ipo_price"
                            type="number"
                            value={formData.ipo_price}
                            onChange={(e) => setFormData((prev) => ({ ...prev, ipo_price: e.target.value }))}
                            placeholder="325"
                          />
                        </div>

                        <div>
                          <Label htmlFor="listing_price">Listing Price</Label>
                          <Input
                            id="listing_price"
                            type="number"
                            value={formData.listing_price}
                            onChange={(e) => setFormData((prev) => ({ ...prev, listing_price: e.target.value }))}
                            placeholder="380"
                          />
                        </div>

                        <div>
                          <Label htmlFor="current_market_price">Current Price</Label>
                          <Input
                            id="current_market_price"
                            type="number"
                            value={formData.current_market_price}
                            onChange={(e) => setFormData((prev) => ({ ...prev, current_market_price: e.target.value }))}
                            placeholder="420"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Document Uploads */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Documents</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FileUpload
                          type="rhp"
                          label="Red Herring Prospectus (RHP)"
                          currentFile={formData.rhp_pdf}
                          onUpload={(url) => setFormData((prev) => ({ ...prev, rhp_pdf: url }))}
                        />

                        <FileUpload
                          type="drhp"
                          label="Draft Red Herring Prospectus (DRHP)"
                          currentFile={formData.drhp_pdf}
                          onUpload={(url) => setFormData((prev) => ({ ...prev, drhp_pdf: url }))}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button type="submit" className="flex-1">
                        {editingIPO ? "Update IPO" : "Create IPO"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* IPO List */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="p-4 font-medium">Company</th>
                        <th className="p-4 font-medium">Price Band</th>
                        <th className="p-4 font-medium">Open Date</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ipos.map((ipo) => (
                        <tr key={ipo.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={ipo.logo || "/placeholder.svg"}
                                alt={`${ipo.company_name} logo`}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <div>
                                <p className="font-medium">{ipo.company_name}</p>
                                <p className="text-sm text-muted-foreground">{ipo.issue_size}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">{ipo.price_band}</td>
                          <td className="p-4">{new Date(ipo.open_date).toLocaleDateString()}</td>
                          <td className="p-4">
                            <Badge className={getStatusColor(ipo.status)}>{ipo.status}</Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(ipo)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDelete(ipo.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
