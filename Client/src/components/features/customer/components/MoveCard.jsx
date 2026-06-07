const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  quoted: "bg-purple-100 text-purple-700",
  confirmed: "bg-blue-100 text-blue-700",
  "in-progress": "bg-indigo-100 text-indigo-700",
  completed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function MoveCard({ from, to, date, status, price }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100">
      <div>
        <p className="font-semibold text-slate-800">
          {from} <span className="mx-1 text-slate-400">to</span> {to}
        </p>
        <p className="mt-1 text-sm text-slate-500">Date: {date}</p>
      </div>

      {price && (
        <p className="text-sm font-semibold text-green-600">
          Quote Price: Rs. {price}
        </p>
      )}

      <span
        className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${statusColor[status] || "bg-slate-100 text-slate-700"}`}
      >
        {status}
      </span>
    </div>
  );
}
