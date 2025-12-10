import React, { useState } from "react";
import toast from "react-hot-toast";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate network request
    setTimeout(() => {
      toast.success(`Thank you ${form.name}! Your message has been received.`);
      setForm({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="contact-page-wrapper fade-in">
      <div className="contact-container glass-panel">
        {/* Left Side: Info */}
        <div className="contact-info">
          <h1>Get in Touch</h1>
          <p className="contact-subtitle">We'd love to hear from you. Our wellness team is always here to chat.</p>

          <div className="info-items">
            <div className="info-item">
              <div className="icon-circle">📧</div>
              <div>
                <h4>Chat to us</h4>
                <p>Our friendly team is here to help.</p>
                <a href="mailto:udaykiranvempati123@gmail.com" className="contact-link">udaykiranvempati123@gmail.com</a>
              </div>
            </div>
            <div className="info-item">
              <div className="icon-circle">📍</div>
              <div>
                <h4>Visit us</h4>
                <p>Come say hello at our HQ.</p>
                <p>KL University, Vaddeswaram,<br />Andhra Pradesh</p>
              </div>
            </div>
            <div className="info-item">
              <div className="icon-circle">📞</div>
              <div>
                <h4>Call us</h4>
                <p>Mon-Fri from 8am to 5pm.</p>
                <p>+91 8185892753</p>
              </div>
            </div>
          </div>

          <div className="social-links">
            <a href="#" className="social-icon">Twitter</a>
            <a href="#" className="social-icon">Instagram</a>
            <a href="#" className="social-icon">LinkedIn</a>
          </div>

          {/* Map Placeholder */}
          <div className="glass-panel" style={{ marginTop: '2rem', height: '150px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.1)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.5, backgroundImage: 'url(https://mt1.google.com/vt/lyrs=m&x=1325&y=3143&z=13)', backgroundSize: 'cover' }}></div>
            <button className="btn btn-sm btn-primary" style={{ position: 'relative', zIndex: 2 }} onClick={() => window.open('https://maps.google.com')}>
              🗺️ Open in Maps
            </button>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="contact-form-wrapper">
          <form className="contact-form-premium" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Your Email</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                placeholder="How can we help you?"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
                className="form-control"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-full-width" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
