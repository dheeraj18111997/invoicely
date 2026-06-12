import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import './styles/InvoicePreview.css'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function InvoicePreview({ from, to, invoiceDetails, lineItems, taxRate, subtotal, taxAmount, total, onEdit }) {
  const invoiceRef = useRef(null)
  const [generating, setGenerating] = useState(false)

  async function handleDownloadPDF() {
    if (!invoiceRef.current) return
    setGenerating(true)
    try {
      const element = invoiceRef.current

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      })

      const imgData = canvas.toDataURL('image/png')

      // A4 dimensions in mm
      const pdfWidth = 210
      const pdfHeight = 297

      const imgWidthPx = canvas.width
      const imgHeightPx = canvas.height

      // Scale image to fit A4 width, then calculate how many pages it needs
      const imgWidthMm = pdfWidth
      const imgHeightMm = (imgHeightPx / imgWidthPx) * pdfWidth

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

      if (imgHeightMm <= pdfHeight) {
        // Fits on a single page — center vertically with a small top margin
        const yOffset = 10
        pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidthMm, imgHeightMm)
      } else {
        // Multi-page: slice the canvas into A4-height segments
        const pageHeightPx = Math.floor((pdfHeight / imgWidthMm) * imgWidthPx)
        let yPx = 0
        let firstPage = true

        while (yPx < imgHeightPx) {
          const sliceCanvas = document.createElement('canvas')
          sliceCanvas.width = imgWidthPx
          sliceCanvas.height = Math.min(pageHeightPx, imgHeightPx - yPx)

          const ctx = sliceCanvas.getContext('2d')
          ctx.drawImage(canvas, 0, yPx, imgWidthPx, sliceCanvas.height, 0, 0, imgWidthPx, sliceCanvas.height)

          const sliceData = sliceCanvas.toDataURL('image/png')
          const sliceHeightMm = (sliceCanvas.height / imgWidthPx) * pdfWidth

          if (!firstPage) pdf.addPage()
          pdf.addImage(sliceData, 'PNG', 0, 0, pdfWidth, sliceHeightMm)

          yPx += pageHeightPx
          firstPage = false
        }
      }

      pdf.save(`${invoiceDetails.number || 'invoice'}.pdf`)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="preview-page">
      <nav className="navbar no-print">
        <div className="nav-logo">Invoicely</div>
      </nav>

      <div className="preview-actions no-print">
        <button className="edit-btn" onClick={onEdit}>
          &#8592; Edit Invoice
        </button>
        <button className="download-btn" onClick={handleDownloadPDF} disabled={generating}>
          {generating ? 'Generating PDF...' : 'Download PDF'}
        </button>
      </div>

      <div className="invoice-doc" ref={invoiceRef}>
        <div className="invoice-header">
          <div className="invoice-sender">
            <p className="sender-name">{from.name || 'Your Name'}</p>
            {from.email && <p>{from.email}</p>}
            {from.phone && <p>{from.phone}</p>}
          </div>
          <div className="invoice-brand-block">
            <div className="brand-name">Invoicely</div>
            <div className="invoice-meta">
              <div className="meta-row">
                <span className="meta-label">Invoice</span>
                <span className="meta-value">{invoiceDetails.number}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Date</span>
                <span className="meta-value">{formatDate(invoiceDetails.date)}</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Due</span>
                <span className="meta-value">{formatDate(invoiceDetails.dueDate)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="invoice-bill-to">
          <p className="bill-to-label">Bill To</p>
          <p className="bill-to-name">{to.name || 'Client Name'}</p>
          {to.company && <p className="bill-to-detail">{to.company}</p>}
          {to.email && <p className="bill-to-detail">{to.email}</p>}
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th className="col-desc">Description</th>
              <th className="col-qty">Qty</th>
              <th className="col-rate">Rate</th>
              <th className="col-amount">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item, index) => (
              <tr key={index}>
                <td>{item.description || <span className="empty-desc">&mdash;</span>}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-right">${parseFloat(item.rate).toFixed(2)}</td>
                <td className="text-right">${(item.quantity * item.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-totals">
          <div className="totals-inner">
            <div className="total-line">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Tax ({taxRate}%)</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="total-line total-final">
              <span>Total Due</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="invoice-note">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  )
}

export default InvoicePreview
