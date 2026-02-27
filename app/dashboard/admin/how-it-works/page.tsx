'use client';

import {
  LayoutDashboard, Package, Truck, Users, BarChart3, Clipboard,
  ArrowRight, Info, Lightbulb, BookOpen, HelpCircle, CheckCircle
} from 'lucide-react';
import Link from 'next/link';

function Step({ number, title, description, tips }: { number: number; title: string; description: string; tips?: string[] }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: 'var(--orange)' }}>{number}</div>
        <div className="flex-1 w-0.5 mt-2" style={{ background: 'var(--border)' }} />
      </div>
      <div className="pb-8">
        <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h4>
        <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{description}</p>
        {tips && (
          <div className="mt-3 p-3 rounded-lg" style={{ background: 'var(--orange-100)' }}>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Lightbulb className="w-3.5 h-3.5" style={{ color: 'var(--orange)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--orange)' }}>Tips</span>
            </div>
            <ul className="space-y-1">
              {tips.map((tip, i) => (
                <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--orange)' }}>•</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ icon, title, subtitle, href, linkLabel, children }: { icon: React.ReactNode; title: string; subtitle: string; href: string; linkLabel: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--surface)] rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--border)' }}>
      <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--orange-100)' }}>{icon}</div>
          <div>
            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
          </div>
        </div>
        <Link href={href} className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--orange)' }}>
          {linkLabel} <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function AdminHowItWorksPage() {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--navy)' }}>
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>How It Works — Admin Guide</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Master the operations platform: shipments, drivers, fleet, and analytics.</p>
        </div>
      </div>

      <div className="p-5 rounded-xl flex items-start gap-3" style={{ background: 'var(--info-light)' }}>
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--info)' }} />
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--info)' }}>Admin Operations Overview</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            As an admin, you oversee the entire logistics operation: <strong>Monitor KPIs → Manage Shipments → Assign Drivers via Load Board → Oversee Fleet → Manage Users → Analyse Performance</strong>.
          </p>
        </div>
      </div>

      {/* Command Center */}
      <Section icon={<LayoutDashboard className="w-5 h-5" style={{ color: 'var(--orange)' }} />} title="Command Centre" subtitle="Real-time overview of all operations" href="/dashboard/admin" linkLabel="Open Dashboard">
        <Step number={1} title="Monitor KPI Cards" description="Four cards display: Total Revenue (with quarterly trend), Active Shipments (vs total), Available Drivers (vs total), and Fleet Status (active vs maintenance). These update in real-time." />
        <Step number={2} title="Analyse Revenue Chart" description="The bar chart shows monthly revenue for the last 6 months. Hover over bars to see exact figures. A green badge shows the quarterly growth percentage." />
        <Step number={3} title="Check Operations Summary" description="Progress bars show: On-Time Delivery Rate, Fleet Utilisation, Driver Availability, and Customer Satisfaction. These are your key operational health indicators." tips={['If any metric drops below 80%, investigate immediately.', 'The "unassigned loads" alert shows loads needing driver assignment.']} />
        <Step number={4} title="Review Recent Activity" description="A feed of the latest platform events: new bookings, driver pickups, client registrations, payments received, and vehicle status changes. Use this to stay current with operations." />
      </Section>

      {/* Shipments */}
      <Section icon={<Package className="w-5 h-5" style={{ color: 'var(--orange)' }} />} title="Shipments Management" subtitle="View and manage every shipment across the platform" href="/dashboard/admin/shipments" linkLabel="View Shipments">
        <Step number={1} title="Browse All Shipments" description="A comprehensive table lists every shipment: waybill number, route, client name, driver (if assigned), vehicle plate, status badge, and value in Naira." />
        <Step number={2} title="Understand Status Badges" description="Colour-coded badges: Blue (Pending) → Yellow (Confirmed) → Orange (Picked Up/In-Transit) → Green (Delivered) → Red (Cancelled). Filter by clicking status headers." tips={['Pending shipments need driver assignment via the Load Board.', 'Monitor "In-Transit" shipments daily for anomalies.']} />
        <Step number={3} title="Track Shipment Progress" description="Each shipment row shows the full journey from booking to delivery. Cross-reference with driver and client information to resolve any disputes or delays." />
      </Section>

      {/* Load Board */}
      <Section icon={<Clipboard className="w-5 h-5" style={{ color: 'var(--orange)' }} />} title="Load Board" subtitle="Assign drivers to loads and manage dispatching" href="/dashboard/admin/loads" linkLabel="Open Load Board">
        <Step number={1} title="Identify Unassigned Loads" description="Unassigned loads appear at the top with a red pulsing indicator and a yellow warning border. Each shows the waybill, route, client name, weight, cargo type, and value." />
        <Step number={2} title="Assign a Driver" description="Below each unassigned load, available drivers are shown as clickable cards with their name, avatar, vehicle type, and star rating. Click a driver to assign them to the load instantly." tips={['Match vehicle type to cargo requirements (e.g., refrigerated trucks for perishables).', 'Consider driver ratings and proximity to the pickup location.', 'Once assigned, the shipment status changes to "Confirmed" automatically.']} />
        <Step number={3} title="Monitor Assigned Loads" description="The bottom section shows all assigned loads in a table: waybill, route, client, assigned driver, vehicle plate, status, and value. Use this to ensure all loads are progressing." />
      </Section>

      {/* Fleet */}
      <Section icon={<Truck className="w-5 h-5" style={{ color: 'var(--orange)' }} />} title="Fleet Management" subtitle="Monitor vehicles, maintenance, and availability" href="/dashboard/admin/fleet" linkLabel="View Fleet">
        <Step number={1} title="Check Fleet Summary" description="Three summary cards show: Active vehicles (ready for dispatch), Maintenance (currently being serviced), and Inactive vehicles. This is your fleet availability snapshot." />
        <Step number={2} title="Browse Vehicle Details" description="The table lists every vehicle: plate number, type (Flatbed, Tanker, Box Truck, etc.), capacity in tonnes, current status, assigned driver, and last service date." tips={['Schedule maintenance proactively based on mileage and last service date.', 'Inactive vehicles should be investigated — they may need repair or reassignment.']} />
        <Step number={3} title="Manage Vehicle Assignments" description="Cross-reference vehicle assignments with the Load Board to ensure optimal fleet utilisation. Reassign vehicles when drivers are off-duty or vehicles need service." />
      </Section>

      {/* Users */}
      <Section icon={<Users className="w-5 h-5" style={{ color: 'var(--orange)' }} />} title="User Management" subtitle="Manage clients and drivers" href="/dashboard/admin/users" linkLabel="Manage Users">
        <Step number={1} title="View Client Registry" description="The Clients section shows all registered clients with their name, company, email, phone, total shipments booked, total spend, and registration date." />
        <Step number={2} title="View Driver Registry" description="The Drivers section lists all drivers: name, phone, assigned vehicle, license plate, rating (out of 5), current status (available/on-trip/offline), and completed trips." tips={['Drivers marked "Offline" may need follow-up — check if they have logged in recently.', 'Use ratings to identify top-performing drivers for priority assignments.']} />
        <Step number={3} title="Analyse User Activity" description="Use the user data to identify: inactive clients for re-engagement, high-value clients for premium service, under-performing drivers for training, and top drivers for rewards." />
      </Section>

      {/* Analytics */}
      <Section icon={<BarChart3 className="w-5 h-5" style={{ color: 'var(--orange)' }} />} title="Analytics" subtitle="Deep-dive into performance data" href="/dashboard/admin/analytics" linkLabel="View Analytics">
        <Step number={1} title="Revenue Trend" description="A line chart shows revenue trends over the past 6 months. Identify growth patterns, seasonal dips, and set targets based on historical performance." />
        <Step number={2} title="Delivery Performance" description="Progress bars show on-time vs late delivery rates. Drill down to see which routes or drivers have the best and worst on-time delivery percentages." tips={['Target 95%+ on-time delivery rate.', 'Investigate routes with consistently low performance — consider alternative paths or additional drivers.']} />
        <Step number={3} title="Top Routes" description="A ranked list of the most popular routes by shipment volume and revenue. Use this to allocate more resources (drivers and vehicles) to high-demand corridors." />
      </Section>

      {/* Admin Best Practices */}
      <div className="bg-[var(--surface)] rounded-xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 mb-5">
          <CheckCircle className="w-5 h-5" style={{ color: 'var(--success)' }} />
          <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Admin Best Practices</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: 'Daily Check-In', text: 'Start each day by checking the Command Centre for unassigned loads and fleet status.' },
            { title: 'Assign Loads Promptly', text: 'Unassigned loads should be dispatched within 2 hours of booking to maintain client satisfaction.' },
            { title: 'Monitor Driver Performance', text: 'Review driver ratings weekly. Address drivers with ratings below 4.0 through training or reassignment.' },
            { title: 'Schedule Maintenance', text: 'Track vehicle service dates and schedule maintenance before issues arise. Prevention is cheaper than repairs.' },
            { title: 'Client Communication', text: 'Follow up with high-value clients monthly. Check their shipment history and offer volume discounts.' },
            { title: 'Analytics Review', text: 'Review analytics weekly to spot trends early: declining revenue routes, increasing delivery times, etc.' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--slate-50)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{item.title}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-[var(--surface)] rounded-xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 mb-5">
          <HelpCircle className="w-5 h-5" style={{ color: 'var(--orange)' }} />
          <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Frequently Asked Questions</h3>
        </div>
        <div className="space-y-4">
          {[
            { q: 'How do I add a new driver?', a: 'New drivers register through the sign-up page with the "Driver" role. Once registered, they appear automatically in User Management and become available for load assignments.' },
            { q: 'Can I reassign a load to a different driver?', a: 'Currently, reassignment is handled through the Load Board. Unassign the current driver by contacting support, then assign a new driver from the available list.' },
            { q: 'How is revenue calculated?', a: 'Revenue is the total value of all booked shipments. It includes base cost, distance cost, weight cost, and cargo type surcharges, plus 7.5% VAT.' },
            { q: 'What if a client disputes a charge?', a: 'Review the shipment details and invoice in the Shipments section. Contact the client with documentation. Adjustments can be made through the finance team.' },
            { q: 'How do I take a vehicle out of service?', a: 'Update the vehicle status to "Maintenance" in Fleet Management. The vehicle will no longer be available for driver assignment until status is changed back to "Active".' },
          ].map((faq, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--slate-50)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{faq.q}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-6 text-center" style={{ background: 'var(--navy)' }}>
        <h3 className="text-white font-bold text-lg mb-2">Need Technical Support?</h3>
        <p className="text-white/60 text-sm mb-4">For platform issues or feature requests, contact the tech team.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="mailto:tech@obelsdave.com" className="px-6 py-3 rounded-xl text-white font-semibold text-sm" style={{ background: 'var(--orange)' }}>Email: tech@obelsdave.com</a>
          <a href="tel:+2348123456789" className="px-6 py-3 rounded-xl text-white font-semibold text-sm border border-white/20 hover:bg-white/5 transition-colors">Call: +234 812 345 6789</a>
        </div>
      </div>
    </div>
  );
}
