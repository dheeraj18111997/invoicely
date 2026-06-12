import { useState } from 'react'
import InvoicePreview from './InvoicePreview'
import './styles/InvoiceApp.css'

function generateInvoiceNumber() {
  const num = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')
  return `INV-${num}`
}

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function getDueDate() {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
}

function newLineItem() {
  return { description: '', quantity: 1, rate: 0 }
}

function InvoiceApp() {
  const [showPreview, setShowPreview] = useState(false)

  const [from, setFrom] = useState({ name: '', email: '', phone: '' })
  const [to, setTo] = useState({ name: '', email: '', company: '' })
  const [invoiceDetails, setInvoiceDetails] = useState({
    number: generateInvoiceNumber(),
    date: getToday(),
    dueDate: getDueDate(),
  })
  const [lineItems, setLineItems] = useState([newLineItem()])
  const [taxRate, setTaxRate] = useState(0)

  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0)
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount

  function addLineItem() {
    setLineItems(prev => [...prev, newLineItem()])
  }

  function removeLineItem(index) {
    if (lineItems.length > 1) {
      setLineItems(prev => prev.filter((_, i) => i !== index))
    }
  }

  function updateLineItem(index, field, value) {
    setLineItems(prev =>
      prev.map((item, i) =>
        i !== index
          ? item
          : { ...item, [field]: field === 'description' ? value : parseFloat(value) || 0 }
      )
    )
  }

  if (showPreview) {
    return (
      <InvoicePreview
        from={from}
        to={to}
        invoiceDetails={invoiceDetails}
        lineItems={lineItems}
        taxRate={taxRate}
        subtotal={subtotal}
        taxAmount={taxAmount}
        total={total}
        onEdit={() => setShowPreview(false)}
      />
    )
  }

  return (
    <div className="invoice-app">
      <nav className="navbar">
        <div className="nav-logo">Invoicely</div>
      </nav>

      <div className="form-container">
        <h1 className="form-title">New Invoice</h1>

        <div className="form-section">
          <h2>From</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="from-name">Your Name</label>
              <input
                id="from-name"
                type="text"
                placeholder="Jane Doe"
                value={from.name}
                onChange={e => setFrom({ ...from, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="from-email">Your Email</label>
              <input
                id="from-email"
                type="email"
                placeholder="jane@freelance.com"
                value={from.email}
                onChange={e => setFrom({ ...from, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="from-phone">Your Phone</label>
              <input
                id="from-phone"
                type="tel"
                placeholder="+1 234 567 8900"
                value={from.phone}
                onChange={e => setFrom({ ...from, phone: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>To</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="to-name">Client Name</label>
              <input
                id="to-name"
                type="text"
                placeholder="John Smith"
                value={to.name}
                onChange={e => setTo({ ...to, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="to-email">Client Email</label>
              <input
                id="to-email"
                type="email"
                placeholder="john@company.com"
                value={to.email}
                onChange={e => setTo({ ...to, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="to-company">Client Company</label>
              <input
                id="to-company"
                type="text"
                placeholder="Acme Corp"
                value={to.company}
                onChange={e => setTo({ ...to, company: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Invoice Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="inv-number">Invoice Number</label>
              <input
                id="inv-number"
                type="text"
                value={invoiceDetails.number}
                onChange={e => setInvoiceDetails({ ...invoiceDetails, number: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="inv-date">Invoice Date</label>
              <input
                id="inv-date"
                type="date"
                value={invoiceDetails.date}
                onChange={e => setInvoiceDetails({ ...invoiceDetails, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="inv-due">Due Date</label>
              <input
                id="inv-due"
                type="date"
                value={invoiceDetails.dueDate}
                onChange={e => setInvoiceDetails({ ...invoiceDetails, dueDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Line Items</h2>
          <div className="line-items-table">
            <div className="line-items-header" aria-hidden="true">
              <span>Description</span>
              <span>Qty</span>
              <span>Rate ($)</span>
              <span>Amount</span>
              <span></span>
            </div>
            {lineItems.map((item, index) => (
              <div key={index} className="line-item-row">
                <input
                  type="text"
                  placeholder="Service or product description"
                  value={item.description}
                  onChange={e => updateLineItem(index, 'description', e.target.value)}
                  aria-label="Description"
                />
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => updateLineItem(index, 'quantity', e.target.value)}
                  aria-label="Quantity"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.rate}
                  onChange={e => updateLineItem(index, 'rate', e.target.value)}
                  aria-label="Rate"
                />
                <span className="line-amount">${(item.quantity * item.rate).toFixed(2)}</span>
                <button
                  className="remove-btn"
                  onClick={() => removeLineItem(index)}
                  disabled={lineItems.length === 1}
                  aria-label="Remove row"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <button className="add-row-btn" onClick={addLineItem}>
            + Add Row
          </button>
        </div>

        <div className="form-section totals-section">
          <div className="tax-group">
            <div className="form-group">
              <label htmlFor="tax-rate">Tax (%)</label>
              <input
                id="tax-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={taxRate}
                onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="totals-box">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Tax ({taxRate}%)</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button className="preview-btn" onClick={() => setShowPreview(true)}>
            Preview Invoice
          </button>
        </div>
      </div>
    </div>
  )
}

export default InvoiceApp
