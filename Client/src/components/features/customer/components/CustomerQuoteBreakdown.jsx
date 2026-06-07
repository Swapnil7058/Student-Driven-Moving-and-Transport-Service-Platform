const serviceLabels = {
  distance: {
    title: "Distance Charge",
    quantityLabel: "Total distance",
    rateLabel: "Cost per km",
  },
  labor: {
    title: "Students Required",
    quantityLabel: "Total students required",
    rateLabel: "Cost per student",
  },
  truck: {
    title: "Trucks Required",
    quantityLabel: "Total trucks required",
    rateLabel: "Cost per truck",
  },
  driver: {
    title: "Driver Charge",
    quantityLabel: "Total drivers required",
    rateLabel: "Cost per driver",
  },
  specialItems: {
    title: "Special Item Handling",
    quantityLabel: "Special items counted",
    rateLabel: "Handling cost per item",
  },
  tax: {
    title: "Tax",
    quantityLabel: "Tax multiplier",
    rateLabel: "Tax percentage",
  },
};

function formatCurrency(value) {
  return `Rs. ${Number(value || 0).toLocaleString()}`;
}

function formatQuantity(serviceName, quantity) {
  if (serviceName === "distance") {
    return `${quantity} km`;
  }

  return `${quantity}`;
}

export default function CustomerQuoteBreakdown({ quote }) {
  const services = quote.invoice?.services || [];

  if (!services.length) {
    return null;
  }

  const subtotal = services
    .filter((service) => service.name !== "tax")
    .reduce((sum, service) => sum + Number(service.total || 0), 0);

  const taxRow = services.find((service) => service.name === "tax");
  const grandTotal = Number(
    quote.invoice?.total || subtotal + Number(taxRow?.total || 0),
  );

  return (
    <section className="rounded-xl bg-white p-6 shadow">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Quote Price Breakdown
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Review each charge before accepting or rejecting this quote.
          </p>
        </div>
        <div className="rounded-xl bg-green-50 px-4 py-3 text-right">
          <p className="text-sm text-slate-500">Final quoted price</p>
          <p className="text-2xl font-bold text-green-700">
            {formatCurrency(grandTotal)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {services.map((service) => {
          const meta = serviceLabels[service.name] || {
            title: service.name,
            quantityLabel: "Quantity",
            rateLabel: "Rate",
          };

          return (
            <div
              key={service.name}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <h3 className="text-base font-semibold text-slate-800">
                  {meta.title}
                </h3>
                <p className="text-lg font-bold text-slate-900">
                  {formatCurrency(service.total)}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-3">
                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    {meta.quantityLabel}
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {formatQuantity(service.name, service.quantity)}
                  </p>
                </div>

                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    {meta.rateLabel}
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {service.name === "tax"
                      ? `${service.rate}%`
                      : formatCurrency(service.rate)}
                  </p>
                </div>

                <div className="rounded-lg bg-white p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Line total
                  </p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {formatCurrency(service.total)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Subtotal before tax</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">
            {formatCurrency(subtotal)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Tax amount</p>
          <p className="mt-1 text-xl font-semibold text-slate-900">
            {formatCurrency(taxRow?.total || 0)}
          </p>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-slate-500">Grand total</p>
          <p className="mt-1 text-xl font-semibold text-green-700">
            {formatCurrency(grandTotal)}
          </p>
        </div>
      </div>
    </section>
  );
}
