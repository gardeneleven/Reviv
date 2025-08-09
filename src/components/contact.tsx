'use client';

import { useState } from 'react';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: send form (API/Email)
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4 text-amber-500">Contact Us</h2>

      {submitted ? (
        <p className="text-sm text-amber-500" aria-live="polite">
          Thank you! We’ll get back to you soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-amber-500 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b border-amber-500 focus:border-amber-500 outline-none py-2 text-amber-500 placeholder-amber-300"
            />
          </div>

          <div>
            <label className="block text-sm text-amber-500 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b border-amber-500 focus:border-amber-500 outline-none py-2 text-amber-500 placeholder-amber-300"
            />
          </div>

          <div>
            <label className="block text-sm text-amber-500 mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-transparent border-b border-amber-500 focus:border-amber-500 outline-none py-2 text-amber-500 placeholder-amber-300"
            />
          </div>

          <button
            type="submit"
            className="w-full border border-amber-500 text-amber-500 font-medium py-2 rounded-md hover:bg-amber-500 hover:text-white transition"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
