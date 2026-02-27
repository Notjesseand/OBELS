import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { Target, Eye, Heart, Users, Award, TrendingUp, Truck } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden" style={{ background: 'var(--navy)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 bg-white/10 text-white/80">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              Powering Nigeria&apos;s<br /><span className="gradient-text">Supply Chain Future</span>
            </h1>
            <p className="text-lg text-white/60 leading-relaxed max-w-2xl">
              Founded with a vision to modernise freight logistics across Nigeria, OBELS DAVE LOGISTICS LIMITED combines cutting-edge 
              technology with deep local expertise to deliver seamless cargo movement across the nation.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl py-24 font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Our Story</h2>
              <div className="space-y-4 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <p>
                  OBELS DAVE LOGISTICS LIMITED was born from a simple observation: Nigeria&apos;s logistics industry was ripe for 
                  digital transformation. While the nation&apos;s economy grew, the infrastructure for moving goods remained fragmented, 
                  opaque, and inefficient.
                </p>
                <p>
                  We set out to change that. By combining GPS tracking, dynamic pricing algorithms, and automated documentation, 
                  we built a platform that gives shippers full visibility and control over their freight — from quote to delivery.
                </p>
                <p>
                  Today, we operate a fleet of over 500 trucks across all 36 states, serving enterprises from Fortune 500 
                  multinationals to growing SMEs. Our technology-first approach ensures every shipment is tracked, every waybill 
                  is generated, and every delivery is confirmed.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '500+', label: 'Active Trucks', icon: <Truck className="w-5 h-5" /> },
                { value: '15,000+', label: 'Deliveries', icon: <Award className="w-5 h-5" /> },
                { value: '36', label: 'States Covered', icon: <TrendingUp className="w-5 h-5" /> },
                { value: '200+', label: 'Enterprise Clients', icon: <Users className="w-5 h-5" /> },
              ].map((stat, idx) => (
                <div key={idx} className="p-6 bg-white rounded-2xl border text-center" style={{ borderColor: 'var(--border)' }}>
                  <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'var(--orange-100)', color: 'var(--orange)' }}>
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20" style={{ background: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Target className="w-7 h-7" />, title: 'Our Mission', text: 'To provide reliable, technology-driven logistics solutions that empower Nigerian businesses to move goods efficiently and transparently across the nation.' },
              { icon: <Eye className="w-7 h-7" />, title: 'Our Vision', text: 'To be West Africa\'s most trusted and technology-forward logistics company, setting the standard for freight movement across the continent.' },
              { icon: <Heart className="w-7 h-7" />, title: 'Our Values', text: 'Reliability. Transparency. Innovation. Safety. We hold ourselves to the highest standards in every shipment, every route, and every interaction.' },
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-2xl border" style={{ borderColor: 'var(--border)', background: 'var(--slate-50)' }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ background: 'var(--orange-100)', color: 'var(--orange)' }}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: 'var(--navy)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join the OBELS DAVE Network</h2>
          <p className="text-lg text-white/60 mb-8">Whether you&apos;re a shipper or a driver, there&apos;s a place for you on our platform.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-8 py-4 rounded-xl text-white font-semibold transition-all hover:shadow-xl" style={{ background: 'var(--orange)' }}>
              Create Account
            </Link>
            <Link href="/contact" className="px-8 py-4 rounded-xl text-white font-semibold border border-white/20 hover:bg-white/5 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
