import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export interface InvoiceData {
  userId: string
  amount: number
  currency: string
  description: string
  items: InvoiceItem[]
  dueDate?: Date
}

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export class InvoiceGenerator {
  private supabase

  constructor() {
    const cookieStore = cookies()
    this.supabase = createServerClient(cookieStore)
  }

  async generateInvoice(data: InvoiceData): Promise<{ success: boolean; invoiceId?: string; error?: string }> {
    if (!this.supabase) {
      return { success: false, error: "Database connection failed" }
    }

    try {
      // Create invoice record
      const { data: invoice, error } = await this.supabase
        .from("invoices")
        .insert({
          user_id: data.userId,
          amount_paid: data.amount * 100, // Convert to cents
          currency: data.currency,
          status: "draft",
          invoice_data: {
            description: data.description,
            items: data.items,
            dueDate: data.dueDate?.toISOString(),
          },
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Generate PDF (in production, use a PDF generation service)
      const pdfUrl = await this.generateInvoicePDF(invoice)

      // Update invoice with PDF URL
      await this.supabase
        .from("invoices")
        .update({
          invoice_pdf: pdfUrl,
          status: "sent",
        })
        .eq("id", invoice.id)

      return { success: true, invoiceId: invoice.id }
    } catch (error) {
      console.error("Invoice generation error:", error)
      return { success: false, error: "Failed to generate invoice" }
    }
  }

  private async generateInvoicePDF(invoice: any): Promise<string> {
    // In production, integrate with a PDF generation service like:
    // - Puppeteer for HTML to PDF
    // - PDFKit for programmatic PDF generation
    // - External services like DocRaptor or PDFShift

    // For now, return a placeholder URL
    return `https://invoices.tablesalt.ai/${invoice.id}.pdf`
  }

  async sendInvoiceEmail(invoiceId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.supabase) {
      return { success: false, error: "Database connection failed" }
    }

    try {
      const { data: invoice } = await this.supabase
        .from("invoices")
        .select("*, user:user_id(*)")
        .eq("id", invoiceId)
        .single()

      if (!invoice) {
        return { success: false, error: "Invoice not found" }
      }

      // In production, integrate with email service
      console.log("[v0] Sending invoice email to:", invoice.user.email)

      return { success: true }
    } catch (error) {
      console.error("Invoice email error:", error)
      return { success: false, error: "Failed to send invoice email" }
    }
  }
}

export const invoiceGenerator = new InvoiceGenerator()
