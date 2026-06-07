import { useNavigate } from "react-router-dom";

function getBookingAmount(booking) {
  if (booking.invoice?.total != null) {
    return Number(booking.invoice.total);
  }

  if (booking.price != null) {
    return Number(booking.price);
  }

  return null;
}

export default function BookingTable({ bookings }) {
  const navigate = useNavigate();

  const statusStyle = {
    pending: "bg-yellow-100 text-yellow-700",
    quoted: "bg-blue-100 text-blue-700",
    confirmed: "bg-indigo-100 text-indigo-700",
    "in-progress": "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h3 className="mb-4 text-xl font-semibold">Recent Bookings</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-sm text-slate-500">
              <th className="pb-3">Customer</th>
              <th className="pb-3">Move Date</th>
              <th className="pb-3">Move Route</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">View Quote</th>
              <th className="pb-3">View Job</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => {
              const amount = getBookingAmount(booking);

              return (
                <tr
                  key={booking._id}
                  onClick={() => navigate(`/admin/quotes/${booking._id}`)}
                  className="cursor-pointer border-b transition hover:bg-slate-100"
                >
                  <td className="py-3 font-medium text-slate-800">
                    {booking.fullName}
                  </td>

                  <td className="text-sm text-slate-600">
                    {new Date(booking.moveDate).toLocaleDateString()}
                  </td>

                  <td className="text-sm">
                    {booking.zipFrom} to {booking.zipTo}
                  </td>

                  <td className="text-sm">
                    {amount != null ? `Rs. ${amount.toLocaleString()}` : "Not Quoted"}
                  </td>

                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-sm capitalize ${statusStyle[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/admin/quotes/${booking._id}`);
                      }}
                      className="text-sm text-green-600 hover:underline"
                    >
                      Quote
                    </button>
                  </td>

                  <td>
                    {["confirmed", "in-progress", "completed"].includes(
                      booking.status,
                    ) ? (
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          navigate(`/admin/jobs/quote/${booking._id}`);
                        }}
                        className="text-sm text-green-600 hover:underline"
                      >
                        Job
                      </button>
                    ) : (
                      <span className="text-sm text-slate-400">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <p className="py-6 text-center text-slate-500">
            No booking requests yet
          </p>
        )}
      </div>
    </div>
  );
}
