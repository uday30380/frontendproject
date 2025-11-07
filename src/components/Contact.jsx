import React, { useState } from "react";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you ${form.name}! Your message has been received.`);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-section">
      <h2>Contact Us</h2>
      <p>Have questions or feedback? We’d love to hear from you. Reach out to our wellness support team below.</p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows="5"
          value={form.message}
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit">Send Message</button>
      </form>

      <div className="contact-details">
        <p>
          📧 <strong>Email:</strong> <a href="udaykiranvempati123@gmail.com">wellness@university.edu</a>
        </p>
        <p>
          📞 <strong>Phone:</strong> +91 8185892753
        </p>
        <p>
          📍 <strong>Location:</strong> KL University, Vaddeswaram, Andhra Pradesh
        </p>
      </div>
    </div>
  );
}

export default Contact;
