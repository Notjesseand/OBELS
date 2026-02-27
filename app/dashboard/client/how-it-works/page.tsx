'use client';

import {
  LayoutDashboard, Calculator, Truck, FileText, MapPin, Receipt, CreditCard,
  ArrowRight, CheckCircle, Info, Lightbulb, BookOpen, HelpCircle
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
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: 'var(--orange)' }}>
          {number}
        </div>
        <div className="flex-1 w-0.5 mt-2" style={{ background: 'var(--border)' }} />
      </div>
      <div className="pb-8">
        <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{title}</h4>
        <p className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{description}</p>
        {tips && tips.length > 0 && (
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
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--orange-100)' }}>
            {icon}
          </div>
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

export default function ClientHowItWorksPage() {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--navy)' }}>
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>How It Works — Client Guide</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Everything you need to ship your cargo with OBELS DAVE.</p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="p-5 rounded-xl flex items-start gap-3" style={{ background: 'var(--info-light)' }}>
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--info)' }} />
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--info)' }}>Your Shipping Workflow</p>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            As a client, your journey is simple: <strong>Get a Quote → Book a Shipment → Track in Real-Time → Pay Online</strong>. Each step is handled from your dashboard. Below is a detailed walkthrough of every feature available to you.
          </p>
        </div>
      </div>

      {/* 1. Dashboard Overview */}
      <Section
        icon={<LayoutDashboard className="w-5 h-5" style={{ color: 'var(--orange)' }} />}
        title="Dashboard Overview"
        subtitle="Your logistics command centre at a glance"
        href="/dashboard/client"
        linkLabel="Go to Dashboard"
      >
        <div className="space-y-0">
          <Step number={1} title="View Your KPIs" description="When you land on the dashboard, you'll immediately see four key stats: Active Shipments, Total Shipments, Pending Quotes, and Total Spend. These update automatically as your shipments progress." />
          <Step number={2} title="Monitor Active Shipments" description="Below the stats, a table shows all your in-progress shipments with waybill numbers, routes, shipment type (FTL/LTL), current status, estimated arrival, and cost. Click 'View All' to see historical shipments too." />
          <Step number={3} title="Use Quick Actions" description="Four shortcut buttons let you jump straight into: Get a Quote, Book Shipment, Track Cargo, and View Invoices. These are the most common actions you'll need." />
          <Step number={4} title="Check Recent Quotes" description="The Recent Quotes section shows your latest price estimates with their status (pending, accepted, or expired). If a quote is still valid, you can proceed to book directly." />
        </div>
      </Section>

      {/* 2. Request a Quote */}
      <Section
        icon={<Calculator className="w-5 h-5" style={{ color: 'var(--orange)' }} />}
        title="Request a Quote"
        subtitle="Get instant pricing for your shipment"
        href="/dashboard/client/quote"
        linkLabel="Get a Quote"
      >
        <div className="space-y-0">
          <Step number={1} title="Choose Shipment Type" description="Select between FTL (Full Truckload) — for when your cargo fills an entire truck, or LTL (Less-Than-Truckload) — for smaller loads that share truck space with others. LTL is more cost-effective for lighter shipments." tips={['Choose FTL if your shipment is over 10,000 kg or requires the entire truck for safety.', 'LTL is ideal for loads under 5,000 kg and can save you up to 40% in costs.']} />
          <Step number={2} title="Enter Route Details" description="Select your pickup city (Origin) and delivery city (Destination) from the dropdown menus. The system covers major Nigerian cities including Lagos, Abuja, Port Harcourt, Kano, Enugu, Ibadan, and more." />
          <Step number={3} title="Specify Cargo" description="Enter your cargo weight in kilograms and select the cargo type: General, Fragile, Perishable, Hazardous, Livestock, or Machinery. Specialised cargo types may incur surcharges to cover extra handling care." tips={['Be accurate with the weight — under-declaring may cause delays at checkpoints.', 'Perishable goods automatically include refrigerated transport surcharges.']} />
          <Step number={4} title="Get Your Price" description="Click 'Calculate Price' to see an instant breakdown of your costs: base cost, distance cost, weight cost, and 7.5% VAT. The total is displayed prominently. If the price works for you, click 'Book This Shipment' to proceed directly to booking." />
        </div>
      </Section>

      {/* 3. Book a Shipment */}
      <Section
        icon={<Truck className="w-5 h-5" style={{ color: 'var(--orange)' }} />}
        title="Book a Shipment"
        subtitle="Confirm and dispatch your freight"
        href="/dashboard/client/book"
        linkLabel="Book Now"
      >
        <div className="space-y-0">
          <Step number={1} title="Fill in Shipment Details (Step 1 of 3)" description="Choose FTL or LTL, select your pickup and delivery cities, enter the weight, select cargo type, and optionally add special instructions (e.g., 'Fragile — do not stack', 'Requires forklift at delivery')." tips={['Add clear special instructions to avoid confusion during handling.', 'Double-check your cities — once booked, route changes may incur additional fees.']} />
          <Step number={2} title="Review Your Booking (Step 2 of 3)" description="A summary screen shows your route, distance, shipment type, cargo type, weight, and the total price including VAT. Review every detail carefully before proceeding." />
          <Step number={3} title="Confirm and Book (Step 3 of 3)" description="Click 'Confirm and Book' to finalise. You'll receive a unique waybill number (e.g., WB260201A1B2) that you can use to track your shipment. A driver will be assigned by the operations team shortly after." tips={['Save your waybill number — you need it for tracking and proof of delivery.', 'You can view all your bookings in the My Shipments section.']} />
        </div>
      </Section>

      {/* 4. My Shipments */}
      <Section
        icon={<FileText className="w-5 h-5" style={{ color: 'var(--orange)' }} />}
        title="My Shipments"
        subtitle="Track the status of all your cargo"
        href="/dashboard/client/shipments"
        linkLabel="View Shipments"
      >
        <div className="space-y-0">
          <Step number={1} title="Filter Shipments" description="Use the status filter tabs at the top (All, In-Transit, Delivered, Pending) to quickly find specific shipments. The count badge next to each filter shows how many shipments are in each category." />
          <Step number={2} title="Read the Shipments Table" description="Each row shows the waybill number, route, type (FTL/LTL), driver name, current status (colour-coded badge), estimated delivery date, and price. Use horizontal scrolling on mobile devices." tips={['Status colours: Blue = Pending, Orange = In-Transit, Green = Delivered, Red = Cancelled.', 'Click a waybill to get extended details about the shipment.']} />
          <Step number={3} title="Check Shipment Progress" description="The status badges update in real-time as the driver progresses through the delivery workflow: Pending → Confirmed → Picked Up → In-Transit → Delivered." />
        </div>
      </Section>

      {/* 5. Live Tracking */}
      <Section
        icon={<MapPin className="w-5 h-5" style={{ color: 'var(--orange)' }} />}
        title="Live Tracking"
        subtitle="See your cargo moving on a real-time map"
        href="/dashboard/client/tracking"
        linkLabel="Track Cargo"
      >
        <div className="space-y-0">
          <Step number={1} title="View the Map" description="The tracking page shows an interactive map of Nigeria with markers for each of your active shipments. Zoom in and out to see routes and current locations." />
          <Step number={2} title="Select a Shipment" description="Click on any shipment marker on the map or pick from the sidebar list. The list shows the waybill, route, and current delivery status of each active shipment." />
          <Step number={3} title="View Shipment Details" description="Once selected, a detail panel shows the complete shipment information: waybill, origin, destination, assigned driver, vehicle plate, cargo type, and current status. This information is updated in real-time as the driver moves." tips={['The map auto-centres on the selected shipment for easy viewing.', 'Contact our support team if a shipment appears stuck at an unexpected location.']} />
        </div>
      </Section>

      {/* 6. Invoices */}
      <Section
        icon={<Receipt className="w-5 h-5" style={{ color: 'var(--orange)' }} />}
        title="Invoices"
        subtitle="View and manage your payment history"
        href="/dashboard/client/invoices"
        linkLabel="View Invoices"
      >
        <div className="space-y-0">
          <Step number={1} title="Review Summary Cards" description="At the top, three cards show your Total Paid, Outstanding Balance, and Total number of Invoices. This gives you an instant overview of your financial position." />
          <Step number={2} title="Browse the Invoice Table" description="Each row shows the invoice number, shipment waybill, issue date, amount, and payment status (Paid or Unpaid). Paid invoices are marked in green; unpaid ones in yellow." tips={['Export invoices for your records (coming soon).', 'Contact support if you notice any discrepancy in billing.']} />
          <Step number={3} title="Pay Outstanding Invoices" description="If you have unpaid invoices, navigate to the Payments page to settle them online using Paystack or Flutterwave." />
        </div>
      </Section>

      {/* 7. Payments */}
      <Section
        icon={<CreditCard className="w-5 h-5" style={{ color: 'var(--orange)' }} />}
        title="Make a Payment"
        subtitle="Pay securely via Paystack or Flutterwave"
        href="/dashboard/client/payment"
        linkLabel="Pay Now"
      >
        <div className="space-y-0">
          <Step number={1} title="Select a Payment Gateway" description="Choose between Paystack (supports cards, bank transfer, and USSD) or Flutterwave (supports cards, mobile money, and bank transfer). Both are PCI-DSS compliant and secure." tips={['Paystack is recommended for Nigerian debit cards.', 'Flutterwave supports international card payments.']} />
          <Step number={2} title="Select Currency" description="Choose between Nigerian Naira (₦) or US Dollars ($). The amount will be pre-filled based on your outstanding invoice." />
          <Step number={3} title="Enter or Confirm Amount" description="The payment amount is pre-filled from your invoice. You can adjust it if making a partial payment. The currency symbol updates automatically." />
          <Step number={4} title="Complete Payment" description="Click 'Pay with Paystack' or 'Pay with Flutterwave'. You'll be redirected to the payment gateway's secure checkout. After successful payment, you'll see a confirmation screen and a receipt will be sent to your email." tips={['All payments are encrypted with 256-bit SSL.', 'A receipt is automatically emailed to your registered address.']} />
        </div>
      </Section>

      {/* FAQ */}
      <div className="bg-[var(--surface)] rounded-xl border shadow-sm p-6" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 mb-5">
          <HelpCircle className="w-5 h-5" style={{ color: 'var(--orange)' }} />
          <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Frequently Asked Questions</h3>
        </div>
        <div className="space-y-4">
          {[
            { q: 'How do I cancel a shipment?', a: 'Contact our support team at info@obelsdave.com or call +234 812 345 6789. Cancellations before driver pickup are free of charge.' },
            { q: 'What happens if my cargo is damaged?', a: 'OBELS DAVE Logistics provides insurance coverage for all shipments. File a claim within 48 hours of delivery through our support channel.' },
            { q: 'Can I schedule a pickup for a future date?', a: 'Yes, add the preferred pickup date in the special instructions field when booking your shipment.' },
            { q: 'How long does delivery take?', a: 'Delivery times depend on the route. For example, Lagos to Abuja typically takes 1-2 days, while Lagos to Kano takes 2-3 days.' },
            { q: 'What cargo types do you support?', a: 'We handle General, Fragile, Perishable (refrigerated), Hazardous, Livestock, and Machinery. Each type has specific handling requirements reflected in the pricing.' },
          ].map((faq, i) => (
            <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--slate-50)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{faq.q}</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Support CTA */}
      <div className="rounded-xl p-6 text-center" style={{ background: 'var(--navy)' }}>
        <h3 className="text-white font-bold text-lg mb-2">Need More Help?</h3>
        <p className="text-white/60 text-sm mb-4">Our support team is available 24/7 to assist you.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="mailto:info@obelsdave.com" className="px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg" style={{ background: 'var(--orange)' }}>
            Email Support
          </a>
          <a href="tel:+2348123456789" className="px-6 py-3 rounded-xl text-white font-semibold text-sm border border-white/20 hover:bg-white/5 transition-colors">
            Call +234 812 345 6789
          </a>
        </div>
      </div>
    </div>
  );
}
