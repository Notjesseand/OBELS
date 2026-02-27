'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import {
  Truck, Package, MapPin, Clock, Shield, ChevronRight,
  Calculator, ArrowRight, Star, Users, Route, Zap, Globe
} from 'lucide-react';
import { calculatePrice, getDistance, getAvailableCities } from '@/lib/pricing';
import { formatCurrency, CargoType, getCargoLabel } from '@/lib/utils';

export default function HomePage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [cargoType, setCargoType] = useState<CargoType>('general');
  const [quoteResult, setQuoteResult] = useState<ReturnType<typeof calculatePrice> | null>(null);

  const cities = getAvailableCities();

  const handleQuote = () => {
    if (!origin || !destination || !weight) return;
    const dist = getDistance(origin, destination);
    if (!dist) return;
    const result = calculatePrice(dist, parseFloat(weight), cargoType);
    setQuoteResult(result);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20" style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 50%, var(--navy-800) 100%)' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-5" style={{ background: 'var(--orange)' }} />
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full opacity-5" style={{ background: 'var(--orange)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.02]" style={{ background: 'var(--orange)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-white/80">
                <Zap className="w-4 h-4 text-orange" style={{ color: 'var(--orange)' }} />
                Nigeria&apos;s Leading Logistics Platform
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                Move Freight<br />
                <span className="gradient-text">Across Nigeria</span><br />
                With Confidence
              </h1>
              <p className="text-lg text-white/60 max-w-lg leading-relaxed">
                Enterprise-grade trucking and logistics. Real-time tracking, dynamic pricing, and instant waybill generation — all in one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-base transition-all hover:shadow-xl hover:shadow-orange/20 hover:-translate-y-0.5"
                  style={{ background: 'var(--orange)' }}
                >
                  Start Shipping <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#quote"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-base border border-white/20 hover:bg-white/5 transition-all"
                >
                  <Calculator className="w-5 h-5" /> Get Instant Quote
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">500+</p>
                  <p className="text-xs text-white/40">Trucks</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">15K+</p>
                  <p className="text-xs text-white/40">Deliveries</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">36</p>
                  <p className="text-xs text-white/40">States</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">99.2%</p>
                  <p className="text-xs text-white/40">On-Time</p>
                </div>
              </div>
            </div>

            {/* Animated Truck Visual */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/10 animate-spin" style={{ animationDuration: '30s' }} />
                <div className="absolute inset-8 rounded-full border border-white/5" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-2xl flex items-center justify-center animate-float" style={{ background: 'linear-gradient(135deg, var(--orange), var(--orange-light))' }}>
                    <Truck className="w-20 h-20 text-white" strokeWidth={1.5} />
                  </div>
                </div>
                {/* Orbit icons */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-400" />
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-400" />
                </div>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="relative h-16">
          <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 60" fill="none">
            <path d="M0 60V20C240 45 480 5 720 20C960 35 1200 5 1440 20V60H0Z" fill="var(--bg)" />
          </svg>
        </div>
      </section>

      {/* Instant Quote Calculator */}
      <section id="quote" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4" style={{ background: 'var(--orange-100)', color: 'var(--orange)' }}>
              <Calculator className="w-4 h-4" /> Instant Pricing
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Get Your Shipping Quote in Seconds
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Enter your shipment details below for an instant price estimate. No registration required.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-2xl shadow-lg border p-8" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Origin City</label>
                <select
                  value={origin}
                  onChange={e => setOrigin(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties}
                >
                  <option value="">Select origin</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Destination City</label>
                <select
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties}
                >
                  <option value="">Select destination</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Weight (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Cargo Type</label>
                <select
                  value={cargoType}
                  onChange={e => setCargoType(e.target.value as CargoType)}
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ borderColor: 'var(--border)', background: 'var(--slate-50)', '--tw-ring-color': 'var(--orange)' } as React.CSSProperties}
                >
                  {(['general', 'fragile', 'perishable', 'hazardous', 'livestock', 'machinery'] as CargoType[]).map(t => (
                    <option key={t} value={t}>{getCargoLabel(t)}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleQuote}
              disabled={!origin || !destination || !weight}
              className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'var(--orange)' }}
            >
              Calculate Price
            </button>

            {quoteResult && (
              <div className="mt-6 p-6 rounded-xl animate-fade-in" style={{ background: 'var(--navy)', color: 'white' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-white/60">Estimated shipping cost</span>
                  <span className="text-sm px-3 py-1 rounded-full bg-white/10 text-white/80">
                    {origin} → {destination}
                  </span>
                </div>
                <p className="text-4xl font-black mb-4" style={{ color: 'var(--orange)' }}>
                  {formatCurrency(quoteResult.total)}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-white/40">Base Cost</p>
                    <p className="font-semibold">{formatCurrency(quoteResult.baseCost)}</p>
                  </div>
                  <div>
                    <p className="text-white/40">Distance</p>
                    <p className="font-semibold">{formatCurrency(quoteResult.distanceCost)}</p>
                  </div>
                  <div>
                    <p className="text-white/40">Weight</p>
                    <p className="font-semibold">{formatCurrency(quoteResult.weightCost)}</p>
                  </div>
                  <div>
                    <p className="text-white/40">VAT (7.5%)</p>
                    <p className="font-semibold">{formatCurrency(quoteResult.vat)}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                  <Link href="/signup" className="flex-1 py-3 rounded-lg text-center text-white font-semibold text-sm transition-all hover:shadow-lg" style={{ background: 'var(--orange)' }}>
                    Book This Shipment
                  </Link>
                  <Link href="/contact" className="flex-1 py-3 rounded-lg text-center text-white/80 font-medium text-sm border border-white/20 hover:bg-white/5 transition-all">
                    Talk to Sales
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Our Logistics Services
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              From full truckloads to express parcels, we have the capacity and expertise to move your freight safely across Nigeria.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Truck className="w-7 h-7" />,
                title: 'Full Truckload (FTL)',
                desc: 'Dedicated trucks for large shipments. Direct door-to-door delivery with no stops or handling between pickup and delivery.',
                features: ['Dedicated vehicle', 'Faster transit', 'Direct route'],
              },
              {
                icon: <Package className="w-7 h-7" />,
                title: 'Less-Than-Truckload (LTL)',
                desc: 'Share truck space and costs with other shippers. Ideal for smaller loads that don\'t need an entire truck.',
                features: ['Cost-effective', 'Flexible sizing', 'Scheduled routes'],
              },
              {
                icon: <Zap className="w-7 h-7" />,
                title: 'Express Delivery',
                desc: 'Time-critical shipments that need to arrive within 24–48 hours. Priority handling and routing.',
                features: ['24-48hr delivery', 'Priority handling', 'Real-time updates'],
              },
              {
                icon: <MapPin className="w-7 h-7" />,
                title: 'GPS Live Tracking',
                desc: 'Monitor your cargo in real-time on an interactive map. Get instant notifications at every milestone.',
                features: ['Live map view', 'ETA updates', 'Milestone alerts'],
              },
              {
                icon: <Shield className="w-7 h-7" />,
                title: 'Cargo Insurance',
                desc: 'Comprehensive coverage for your goods in transit. Full protection against damage, theft, and loss.',
                features: ['Full coverage', 'Quick claims', 'Peace of mind'],
              },
              {
                icon: <Globe className="w-7 h-7" />,
                title: 'Cross-Border Logistics',
                desc: 'Expanding into ECOWAS markets? We handle customs clearance and cross-border trucking seamlessly.',
                features: ['Customs handling', 'ECOWAS routes', 'Documentation'],
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="group p-8 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                style={{ borderColor: 'var(--border)', background: 'var(--slate-50)' }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all group-hover:scale-110" style={{ background: 'var(--orange-100)', color: 'var(--orange)' }}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{service.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>{service.desc}</p>
                <ul className="space-y-2">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--orange)' }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>How It Works</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Ship your goods in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Get a Quote', desc: 'Enter your shipment details and get an instant price estimate.' },
              { step: '02', title: 'Book & Pay', desc: 'Confirm your booking and pay securely via Paystack or Flutterwave.' },
              { step: '03', title: 'Track Live', desc: 'Follow your cargo on the live map with real-time GPS updates.' },
              { step: '04', title: 'Delivery', desc: 'Receive your goods with a signed Proof of Delivery and digital waybill.' },
            ].map((item, idx) => (
              <div key={idx} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center text-xl font-black text-white" style={{ background: 'var(--orange)' }}>
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed" style={{ borderColor: 'var(--border)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20" style={{ background: 'var(--surface)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Trusted by Leading Brands</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Adaeze Okwu', role: 'Supply Chain Manager, Dangote Group', text: 'OBELS DAVE has transformed our supply chain. The real-time tracking and automated waybills save us hours every week.', rating: 5 },
              { name: 'Olumide Adeyemi', role: 'Logistics Director, Nigerian Breweries', text: 'The pricing transparency and reliable delivery times have made them our go-to logistics partner for cold-chain shipments.', rating: 5 },
              { name: 'Chidinma Eze', role: 'Operations Lead, BUA Cement', text: 'Moving heavy machinery across Nigeria used to be a nightmare. With OBELS DAVE, it\'s become seamless and predictable.', rating: 5 },
            ].map((t, idx) => (
              <div key={idx} className="p-8 rounded-2xl border" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)' }}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" style={{ color: 'var(--orange)' }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'var(--navy)' }}>
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'var(--navy)' }}>
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'var(--orange)' }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5" style={{ background: 'var(--orange)' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Streamline Your Logistics?
          </h2>
          <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust OBELS DAVE LOGISTICS for reliable, technology-driven freight movement across Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-base transition-all hover:shadow-xl" style={{ background: 'var(--orange)' }}>
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-semibold text-base border border-white/20 hover:bg-white/5 transition-all">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
