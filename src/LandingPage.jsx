import { useNavigate } from 'react-router-dom'
import './styles/LandingPage.css'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <nav className="navbar">
        <div className="nav-logo">Invoicely</div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Generate Professional Invoices in 30 Seconds</h1>
          <p>Free for freelancers. No signup needed.</p>
          <button className="cta-btn" onClick={() => navigate('/app')}>
            Create Invoice
          </button>
        </div>
      </section>

      <section className="features">
        <h2>Why Invoicely?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">&#9998;</div>
            <h3>Easy to Fill</h3>
            <p>Simple form. Fill in your details and line items in seconds — no learning curve.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">&#8659;</div>
            <h3>Instant PDF Download</h3>
            <p>Download a clean, print-ready PDF with one click. No waiting, no watermarks.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">&#9993;</div>
            <h3>Send to Clients</h3>
            <p>Professional invoices your clients will trust and pay on time.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>Made for Freelancers &mdash; Invoicely</p>
      </footer>
    </div>
  )
}

export default LandingPage
