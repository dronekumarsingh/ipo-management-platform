"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, FileText, ImageIcon } from "lucide-react"

interface FileUploadProps {
  type: "logo" | "rhp" | "drhp"
  onUpload: (url: string) => void
  currentFile?: string
  label: string
}

export function FileUpload({ type, onUpload, currentFile, label }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("type", type)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        onUpload(data.url)
      } else {
        alert(data.error || "Upload failed")
      }
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const getAcceptedTypes = () => {
    switch (type) {
      case "logo":
        return "image/jpeg,image/png,image/webp,image/svg+xml"
      case "rhp":
      case "drhp":
        return "application/pdf"
      default:
        return ""
    }
  }

  const getIcon = () => {
    return type === "logo" ? <ImageIcon className="w-6 h-6" /> : <FileText className="w-6 h-6" />
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {currentFile && (
        <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
          {getIcon()}
          <span className="text-sm flex-1 truncate">{currentFile}</span>
          <Button type="button" variant="ghost" size="sm" onClick={() => onUpload("")}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptedTypes()}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFileSelect(file)
          }}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          {getIcon()}
          <div>
            <p className="text-sm font-medium">{uploading ? "Uploading..." : "Drop file here or click to browse"}</p>
            <p className="text-xs text-muted-foreground">
              {type === "logo" ? "PNG, JPG, WebP or SVG (max 5MB)" : "PDF files only (max 10MB)"}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Choose File"}
          </Button>
        </div>
      </div>
    </div>
  )
}
