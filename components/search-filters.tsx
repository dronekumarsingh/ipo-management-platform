"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, X } from "lucide-react"

interface SearchFiltersProps {
  onSearch: (term: string) => void
  onStatusFilter: (status: string) => void
  onSort: (sortBy: string) => void
  searchTerm: string
  statusFilter: string
  sortBy: string
}

export function SearchFilters({
  onSearch,
  onStatusFilter,
  onSort,
  searchTerm,
  statusFilter,
  sortBy,
}: SearchFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchTerm)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(localSearch)
  }

  const clearFilters = () => {
    setLocalSearch("")
    onSearch("")
    onStatusFilter("all")
    onSort("company_name")
  }

  const hasActiveFilters = searchTerm || statusFilter !== "all" || sortBy !== "company_name"

  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full lg:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search companies..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 pr-10"
            />
            {localSearch && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => {
                  setLocalSearch("")
                  onSearch("")
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </form>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Select value={statusFilter} onValueChange={onStatusFilter}>
            <SelectTrigger className="w-full lg:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="listed">Listed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={onSort}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="company_name">Company Name</SelectItem>
              <SelectItem value="open_date">Open Date</SelectItem>
              <SelectItem value="issue_size">Issue Size</SelectItem>
              <SelectItem value="listing_gain">Listing Gain</SelectItem>
              <SelectItem value="current_return">Current Return</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
