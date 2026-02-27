'use client';

import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <section className="pt-32 pb-20" style={{ background: 'var(--navy)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              Get In <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-lg text-white/60">
              Have a question or need a custom logistics solution? Our team is ready to help.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Contact Information</h2>
              <div className="space-y-5">
                {[
                  { icon: <MapPin className="w-5 h-5" />, title: 'Head Office', text: '15 Apapa Oshodi Expressway\nLagos, Nigeria' },
                  { icon: <Phone className="w-5 h-5" />, title: 'Phone', text: '+234 (0) 812 345 6789\n+234 (0) 809 876 5432' },
                  { icon: <Mail className="w-5 h-5" />, title: 'Email', text: 'info@obelsdave.com.ng\nsales@obelsdave.com.ng' },
                  { icon: <Clock className="w-5 h-5" />, title: 'Business Hours', text: 'Mon - Fri: 7:00AM - 7:00PM\nSat: 8:00AM - 3:00PM' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--orange-100)', color: 'var(--orange)' }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
                      <p className="text-sm whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border p-8" style={{ borderColor: 'var(--border)' }}>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: 'var(--success-light)' }}>
                      <Send className="w-7 h-7" style={{ color: 'var(--success)' }} />
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Message Sent!</h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>We&apos;ll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Send Us a Message</h2>
                    <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                          <input required type="text" placeholder="Your name" className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
                          <input required type="email" placeholder="you@company.com" className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Subject</label>
                        <select className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties}>
                          <option>General Enquiry</option>
                          <option>Request a Quote</option>
                          <option>Partnership</option>
                          <option>Support</option>
                          <option>Careers</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Message</label>
                        <textarea required rows={5} placeholder="Tell us about your logistics needs..." className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 resize-none" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties} />
                      </div>
                      <button type="submit" className="w-full py-4 rounded-xl text-white font-semibold transition-all hover:shadow-lg" style={{ background: 'var(--orange)' }}>
                        Send Message
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
