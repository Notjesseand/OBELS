'use client';

import {
  LayoutDashboard, Truck, DollarSign, Camera,
  ArrowRight, Info, Lightbulb, BookOpen, HelpCircle, CheckCircle
} from 'lucide-react';
import Link from 'next/link';

interface StepProps {
  number: number;
  title: string;
  description: string;
  tips?: string[];
}

function Step({ number, title, description, tips }: StepProps) {
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

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
  linkLabel: string;
  children: React.ReactNode;
}

function Section({ icon, title, subtitle, href, linkLabel, children }: SectionProps) {
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

export default function DriverHowItWorksPage() {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--navy)' }}>
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>How It Works — Driver Guide</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Your complete guide to managing trips, statuses, and earnings.</p>
        </div>
      </div>

      <div className="p-5 rounded-xl flex items-start gap-3" style={{ background: 'var(--info-light)' }}>
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--info)' }} />
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--info)' }}>Your Delivery Workflow</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <strong>Receive Assignment → Pick Up Cargo → Update Status → Deliver → Submit Proof of Delivery</strong>. Everything is managed from your dashboard.
          </p>
        </div>
      </div>

      {/* Status Flow */}
      <div className="bg-[var(--surface)] rounded-xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
        <h3 className="font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Understanding Delivery Statuses</h3>
        <div className="flex flex-wrap items-center gap-3">
          {[
            { label: 'Confirmed', desc: 'Trip assigned to you', color: 'var(--info)' },
            { label: 'Picked Up', desc: 'Cargo collected', color: 'var(--warning)' },
            { label: 'In-Transit', desc: 'On the road', color: 'var(--orange)' },
            { label: 'Delivered', desc: 'Cargo handed over', color: 'var(--success)' },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border" style={{ borderColor: 'var(--border)' }}>
                <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
                </div>
              </div>
              {i < 3 && <ArrowRight className="w-4 h-4 hidden sm:block" style={{ color: 'var(--text-muted)' }} />}
            </div>
          ))}
        </div>
      </div>

      <Section icon={<LayoutDashboard className="w-5 h-5" style={{ color: 'var(--orange)' }} />} title="Driver Dashboard" subtitle="Your home base for active trips and stats" href="/dashboard/driver" linkLabel="Go to Dashboard">
        <Step number={1} title="Check Your Stats" description="Four key metrics at the top: Total Trips completed, Star Rating, Active Trips in progress, and Total Earnings. These update automatically." />
        <Step number={2} title="View Active Trip" description="Your active trip is highlighted with a pulsing 'ACTIVE TRIP' badge. It shows the route, client, vehicle, cargo details, and a status update button." tips={['Keep this page open during deliveries for fast status updates.', 'Your assigned vehicle plate number is shown for checkpoint verification.']} />
        <Step number={3} title="Recent & Upcoming Trips" description="Below the active trip, a table lists all recent and scheduled trips with waybill numbers, routes, ETAs, status badges, and shipment values." />
      </Section>

      <Section icon={<Truck className="w-5 h-5" style={{ color: 'var(--orange)' }} />} title="My Trips" subtitle="Manage and update your assigned deliveries" href="/dashboard/driver/trips" linkLabel="View Trips">
        <Step number={1} title="View All Assigned Trips" description="Every trip assigned to you is displayed as an individual card showing the waybill, route, client name, cargo type, weight, ETA, and value." />
        <Step number={2} title="Track Progress with Status Bar" description="A visual progress bar shows your position in the flow: Confirmed → Picked Up → In-Transit → Delivered. Green checkmarks mark completed stages." />
        <Step number={3} title="Advance the Delivery Status" description="Click the orange 'Mark as [next status]' button to advance. Example: tap 'Mark as picked up' when you collect cargo, 'Mark as in-transit' when driving, and 'Mark as delivered' upon completion." tips={['Only advance when you have ACTUALLY completed that step.', 'Delivered status cannot be reversed — double check before confirming!', 'After delivery, head to Proof of Delivery to submit photos.']} />
        <Step number={4} title="Delivery Complete" description="When marked 'Delivered', the button is replaced by a green 'Delivery Complete' badge. This trip is now archived and counts towards your earnings." />
      </Section>

      <Section icon={<DollarSign className="w-5 h-5" style={{ color: 'var(--orange)' }} />} title="Earnings" subtitle="Track your income and payouts" href="/dashboard/driver/earnings" linkLabel="View Earnings">
        <Step number={1} title="Earnings Summary" description="Three cards: Total Earnings (last 6 months), This Month's earnings with trip count, and Average per trip." />
        <Step number={2} title="Monthly Breakdown" description="A table showing earnings by month: month name, completed trips, and total earnings. Track your income trends over time." tips={['Earnings are calculated from completed trips only.', 'Credited after successful POD submission.']} />
        <Step number={3} title="Payout History" description="Shows all bank transfers: date, bank details, amount, and status (Completed/Processing). This is your payment ledger." tips={['Payouts process within 3-5 business days.', 'Contact admin if status shows "Processing" for more than 5 days.']} />
      </Section>

      <Section icon={<Camera className="w-5 h-5" style={{ color: 'var(--orange)' }} />} title="Proof of Delivery (POD)" subtitle="Upload photos and notes to confirm deliveries" href="/dashboard/driver/pod" linkLabel="Submit POD">
        <Step number={1} title="Select the Shipment" description="Choose the shipment from the dropdown. It shows the waybill number, route, and current status." />
        <Step number={2} title="Upload Delivery Photo" description="Click the upload area to take a photo or upload from your device. The photo should clearly show the delivered goods." tips={['Take a wide-angle shot showing the full delivery.', 'Include the waybill document in the photo if possible.', 'PNG/JPG up to 10MB, good lighting recommended.']} />
        <Step number={3} title="Add Delivery Notes" description="Enter: receiver's name, condition of goods, number of items, and any observations. Example: 'Delivered to Mr. Nwoye. All 150 cartons intact.'" />
        <Step number={4} title="Submit & View History" description="Click 'Submit Proof of Delivery' for confirmation. The POD History below shows all previous submissions with waybill, route, notes, and timestamps." tips={['Submit within 30 minutes of delivery.', 'POD cannot be edited after submission.']} />
      </Section>

      {/* Important Reminders */}
      <div className="bg-[var(--surface)] rounded-xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 mb-5">
          <CheckCircle className="w-5 h-5" style={{ color: 'var(--success)' }} />
          <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Important Reminders</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: 'Update Status Promptly', text: 'Always update your trip status in real-time. Clients rely on accurate tracking.' },
            { title: 'Submit POD Immediately', text: 'Upload proof of delivery within 30 minutes. This triggers payment processing.' },
            { title: 'Keep Phone Charged', text: 'Ensure your device is charged throughout the trip for status updates and POD.' },
            { title: 'Safety First', text: 'Follow traffic regulations and safety protocols. Report incidents to admin immediately.' },
            { title: 'Inspect Cargo', text: 'Check cargo at pickup and note any pre-existing damage in delivery notes.' },
            { title: 'Communication', text: 'Contact admin immediately if you encounter issues like roadblocks or vehicle problems.' },
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
            { q: "What if I can't complete a delivery?", a: 'Contact admin immediately. They will reassign the load or arrange alternatives. Never abandon cargo.' },
            { q: 'How are my earnings calculated?', a: "You earn a percentage of each trip's freight value based on route, cargo type, and experience level." },
            { q: 'When do I get paid?', a: 'Payouts process within 3-5 business days after successful POD submission, directly to your bank account.' },
            { q: 'Can I reject a trip?', a: 'Contact admin. Frequent rejections may affect your availability status and future assignments.' },
            { q: 'What if cargo is damaged in transit?', a: 'Document damage with photos immediately and notify admin. Insurance requires immediate reporting.' },
          ].map((faq, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--slate-50)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{faq.q}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-6 text-center" style={{ background: 'var(--navy)' }}>
        <h3 className="text-white font-bold text-lg mb-2">Need Help on the Road?</h3>
        <p className="text-white/60 text-sm mb-4">Our dispatch team is available 24/7.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="tel:+2348123456789" className="px-6 py-3 rounded-xl text-white font-semibold text-sm" style={{ background: 'var(--orange)' }}>Call Dispatch: +234 812 345 6789</a>
          <a href="mailto:drivers@obelsdave.com" className="px-6 py-3 rounded-xl text-white font-semibold text-sm border border-white/20 hover:bg-white/5 transition-colors">Email: drivers@obelsdave.com</a>
        </div>
      </div>
    </div>
  );
}
