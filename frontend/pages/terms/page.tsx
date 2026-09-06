export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto prose prose-slate">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
        <p className="text-sm text-slate-500 mb-8">Last Updated: August 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Introduction</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Welcome to Qwikaam. These Terms of Service ("Terms") govern your use of the Qwikaam website and mobile application (the "Platform"). By accessing or using the Platform, you agree to be bound by these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. User Responsibilities</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            As a user (Customer) of Qwikaam, you agree to:
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-4">
            <li>Provide accurate and complete information during registration and booking.</li>
            <li>Maintain a safe and respectful environment for Helpers providing services in your home.</li>
            <li>Not use the Platform for any illegal or unauthorized purpose.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Helper Responsibilities</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Helpers registering on the platform are independent contractors and agree to:
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-4">
            <li>Provide services with professionalism and care.</li>
            <li>Arrive on time for scheduled bookings.</li>
            <li>Submit to necessary background and identity checks.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Booking & Cancellation</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Instant bookings can be cancelled free of charge up to 2 hours before the scheduled start time. Cancellations made within 2 hours may incur a cancellation fee. For permanent placements, cancellation terms are governed by the specific contract signed during hiring.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Payment Terms</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            All payments for instant bookings are processed securely through the Platform. For permanent hires, the Platform fee is paid to Qwikaam, while the Helper's monthly salary is negotiated and paid directly to the Helper by the Customer.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Contact Us</h2>
          <p className="text-slate-600 leading-relaxed">
            If you have any questions about these Terms, please contact us at <a href="mailto:legal@qwikaam.com" className="text-teal-600 hover:underline">legal@qwikaam.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
