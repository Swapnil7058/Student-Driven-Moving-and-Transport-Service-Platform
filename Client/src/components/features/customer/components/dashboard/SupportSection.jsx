export default function SupportSection({ onSupportClick, onFaqClick }) {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-6 mb-8">
      <h3 className="text-xl font-semibold text-slate-800 mb-5">
        Support & Help
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={onSupportClick}
          className="flex items-center gap-4 p-5 border rounded-xl hover:bg-slate-50 cursor-pointer transition"
        >
          <span className="text-sm font-semibold text-blue-600 uppercase">
            Call
          </span>
          <div>
            <p className="font-semibold text-slate-700">Contact Support</p>
            <p className="text-sm text-slate-500">
              Get help from our support team
            </p>
          </div>
        </div>

        <div
          onClick={onFaqClick}
          className="flex items-center gap-4 p-5 border rounded-xl hover:bg-slate-50 cursor-pointer transition"
        >
          <span className="text-sm font-semibold text-blue-600 uppercase">
            FAQ
          </span>
          <div>
            <p className="font-semibold text-slate-700">FAQs</p>
            <p className="text-sm text-slate-500">
              Quick answers to common questions
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
        Need urgent help? Call us at
        <strong className="ml-1">(800) 484-1116</strong>
      </div>
    </section>
  );
}
