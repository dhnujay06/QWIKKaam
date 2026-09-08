export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto prose prose-slate">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-sm text-slate-500 mb-8">Last Updated: August 2026</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Information We Collect</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include:
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-4">
            <li>Name, email address, and phone number.</li>
            <li>Home address and location data for service delivery.</li>
            <li>Payment information (processed securely through third-party providers).</li>
            <li>Government ID (Aadhaar) for Helper background verification.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. How We Use It</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-4">
            <li>Facilitate bookings and connect Customers with Helpers.</li>
            <li>Process payments and send receipts.</li>
            <li>Verify identity and perform background checks on Helpers for safety.</li>
            <li>Provide customer support and respond to inquiries.</li>
            <li>Improve and optimize our platform.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Data Sharing</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We share necessary information between Customers and Helpers to facilitate the booked services (e.g., sharing the Customer's address with the booked Helper). We do not sell your personal data to third-party marketers. We may share data with legal authorities if required by law.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Security</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. However, no internet transmission is entirely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Your Rights</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            You have the right to access, correct, or delete your personal data. You can manage your profile information within the Dashboard or contact us to delete your account entirely.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Contact</h2>
          <p className="text-slate-600 leading-relaxed">
            For any privacy-related questions, please email us at <a href="mailto:privacy@qwikkaam.com" className="text-teal-600 hover:underline">privacy@qwikkaam.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
