export default function UpcomingMoveSection({ quote }) {
  if (!quote) return null;

  return (
    <section className="bg-white rounded-xl shadow p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">My Upcoming Move</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-700">
        <p>
          <strong>Move Date:</strong> {quote.moveDate}
        </p>
        <p>
          <strong>Status:</strong>
          <span className="ml-2 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700">
            {quote.status}
          </span>
        </p>
        <p>
          <strong>From:</strong> {quote.zipFrom}
        </p>
        <p>
          <strong>To:</strong> {quote.zipTo}
        </p>
      </div>
    </section>
  );
}
