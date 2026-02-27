import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import Link from 'next/link';
import { Truck, Package, Zap, Shield, Thermometer, Cog, ChevronRight, ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <section className="pt-32 pb-20" style={{ background: 'var(--navy)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 bg-white/10 text-white/80">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              Comprehensive<br /><span className="gradient-text">Logistics Solutions</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed">
              From full truckloads to temperature-controlled delivery, we offer end-to-end logistics 
              services tailored to the Nigerian market.
            </p>
          </div>
        </div>
      </section>

      {/* FTL */}
      <section id="ftl" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ background: 'var(--orange-100)', color: 'var(--orange)' }}>
                <Truck className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Full Truckload (FTL)</h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                When your cargo fills an entire truck, FTL is the fastest and most cost-effective option. 
                Your goods travel direct from origin to destination — no stops, no cross-docking, no delays.
              </p>
              <ul className="space-y-3 mb-8">
                {['Dedicated vehicle for your cargo only', 'Direct route — faster transit times', 'Suitable for loads above 10,000kg', 'Available in flatbed, box, tanker, and low-bed', 'Real-time GPS tracking included'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--orange)' }} />{item}
                  </li>
                ))}
              </ul>
              <Link href="/#quote" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg" style={{ background: 'var(--orange)' }}>
                Get FTL Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl border p-8" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>FTL Vehicle Options</h3>
              <div className="space-y-4">
                {[
                  { type: 'Flatbed Truck', capacity: '20-25 tonnes', use: 'Building materials, steel, machinery' },
                  { type: 'Box Truck', capacity: '8-15 tonnes', use: 'Consumer goods, electronics, FMCG' },
                  { type: 'Low-bed Trailer', capacity: '40-50 tonnes', use: 'Heavy machinery, vehicles, equipment' },
                  { type: 'Tanker', capacity: '30,000-45,000L', use: 'Liquids, petroleum, chemicals' },
                  { type: 'Refrigerated Truck', capacity: '10-20 tonnes', use: 'Perishable goods, pharmaceuticals' },
                ].map((v, i) => (
                  <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--slate-50)' }}>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{v.type}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Capacity: {v.capacity} · {v.use}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LTL */}
      <section id="ltl" className="py-20" style={{ background: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-white rounded-2xl border p-8" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)' }}>
              <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>LTL Benefits</h3>
              <div className="space-y-4">
                {[
                  { title: 'Cost Savings', desc: 'Pay only for the space you use — up to 30% cheaper than FTL for smaller loads.' },
                  { title: 'Flexible Scheduling', desc: 'Frequent departures on popular routes across Nigeria.' },
                  { title: 'No Minimum Volume', desc: 'Ship from 100kg up to 10,000kg without booking a full truck.' },
                  { title: 'Consolidated Tracking', desc: 'Full visibility even in shared-load shipments.' },
                ].map((b, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white border" style={{ borderColor: 'var(--border)' }}>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{b.title}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ background: 'var(--orange-100)', color: 'var(--orange)' }}>
                <Package className="w-7 h-7" />
              </div>
              <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Less-Than-Truckload (LTL)</h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                Don&apos;t have enough cargo to fill a truck? Share space with other shippers and pay proportionally. 
                LTL is the smart choice for medium-sized shipments.
              </p>
              <Link href="/#quote" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg" style={{ background: 'var(--orange)' }}>
                Get LTL Quote <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Other Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>Specialised Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Zap className="w-6 h-6" />, title: 'Express Delivery', desc: '24-48 hour priority shipping for time-critical cargo.' },
              { icon: <Thermometer className="w-6 h-6" />, title: 'Cold Chain', desc: 'Temperature-controlled transport for perishable goods.' },
              { icon: <Shield className="w-6 h-6" />, title: 'Cargo Insurance', desc: 'Full coverage against loss, damage, or theft in transit.' },
              { icon: <Cog className="w-6 h-6" />, title: 'Fleet Management', desc: 'Outsource your fleet ops to our expert team.' },
            ].map((s, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border transition-all hover:shadow-md" style={{ borderColor: 'var(--border)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'var(--orange-100)', color: 'var(--orange)' }}>
                  {s.icon}
                </div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{s.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
