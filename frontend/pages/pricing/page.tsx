import { Check, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Whether you need a quick fix or a permanent helper, we have fair pricing designed for you. No hidden charges.
          </p>
        </div>

        {/* Instant Booking Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">Instant Booking Rates</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-900 text-white font-semibold p-4">
              <div>Service</div>
              <div>Duration</div>
              <div>Price</div>
            </div>
            <div className="divide-y divide-slate-100">
              <div className="grid grid-cols-3 p-4 hover:bg-slate-50">
                <div className="font-medium text-slate-900">Deep Cleaning</div>
                <div className="text-slate-600">Per Hour</div>
                <div className="text-teal-600 font-bold">₹150 / hr</div>
              </div>
              <div className="grid grid-cols-3 p-4 hover:bg-slate-50">
                <div className="font-medium text-slate-900">Cooking (One Meal)</div>
                <div className="text-slate-600">1.5 Hours</div>
                <div className="text-teal-600 font-bold">₹250</div>
              </div>
              <div className="grid grid-cols-3 p-4 hover:bg-slate-50">
                <div className="font-medium text-slate-900">Babysitting</div>
                <div className="text-slate-600">Per Hour</div>
                <div className="text-teal-600 font-bold">₹200 / hr</div>
              </div>
              <div className="grid grid-cols-3 p-4 hover:bg-slate-50">
                <div className="font-medium text-slate-900">Elder Care</div>
                <div className="text-slate-600">Per Day (8 hrs)</div>
                <div className="text-teal-600 font-bold">₹800 / day</div>
              </div>
            </div>
          </div>
        </section>

        {/* Permanent Placement Section */}
        <section>
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Permanent Placement Plans</h2>
          <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto">
            Pay a one-time platform fee to hire a verified helper. The helper's monthly salary is paid directly to them.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Plan 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-2">1 Month Trial</h3>
              <p className="text-slate-500 mb-6 text-sm">Perfect for short-term needs.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">₹999</span>
                <span className="text-slate-500"> / fee</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-700 text-sm"><Check className="w-5 h-5 text-teal-600" /> Background verified helper</li>
                <li className="flex items-center gap-3 text-slate-700 text-sm"><Check className="w-5 h-5 text-teal-600" /> 1 Free replacement</li>
                <li className="flex items-center gap-3 text-slate-700 text-sm"><Check className="w-5 h-5 text-teal-600" /> Dedicated support</li>
              </ul>
              <button className="w-full py-3 rounded-lg border border-teal-600 text-teal-600 font-semibold hover:bg-teal-50 transition-colors">Select Plan</button>
            </div>

            {/* Plan 2 */}
            <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-lg border border-slate-800 flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-teal-400 mb-2">6 Months Contract</h3>
              <p className="text-slate-400 mb-6 text-sm">Our most standard hiring plan.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">₹3,499</span>
                <span className="text-slate-400"> / fee</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-300 text-sm"><Check className="w-5 h-5 text-teal-400" /> Background verified helper</li>
                <li className="flex items-center gap-3 text-slate-300 text-sm"><Check className="w-5 h-5 text-teal-400" /> 3 Free replacements</li>
                <li className="flex items-center gap-3 text-slate-300 text-sm"><Check className="w-5 h-5 text-teal-400" /> Priority support</li>
                <li className="flex items-center gap-3 text-slate-300 text-sm"><Check className="w-5 h-5 text-teal-400" /> Salary negotiation assistance</li>
              </ul>
              <button className="w-full py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-500 transition-colors">Select Plan</button>
            </div>

            {/* Plan 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-2">1 Year Contract</h3>
              <p className="text-slate-500 mb-6 text-sm">For complete peace of mind.</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-slate-900">₹5,999</span>
                <span className="text-slate-500"> / fee</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-700 text-sm"><Check className="w-5 h-5 text-teal-600" /> Background verified helper</li>
                <li className="flex items-center gap-3 text-slate-700 text-sm"><Check className="w-5 h-5 text-teal-600" /> Unlimited replacements</li>
                <li className="flex items-center gap-3 text-slate-700 text-sm"><Check className="w-5 h-5 text-teal-600" /> 24/7 Priority support</li>
                <li className="flex items-center gap-3 text-slate-700 text-sm"><Check className="w-5 h-5 text-teal-600" /> Police verification included</li>
              </ul>
              <button className="w-full py-3 rounded-lg border border-teal-600 text-teal-600 font-semibold hover:bg-teal-50 transition-colors">Select Plan</button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
