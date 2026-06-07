import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuote, updateInvoice } from "../services/quoteService";

const EMPTY_SERVICES = {
  distance: { rate: "", quantity: "", total: 0 },
  labor: { rate: "", quantity: "", total: 0 },
  truck: { rate: "", quantity: "", total: 0 },
  driver: { rate: "", quantity: "", total: 0 },
  specialItems: { rate: "", quantity: "", total: 0 },
  tax: { rate: 18, quantity: 1, total: 0 },
};

const propertyWorkerMap = {
  studio: 2,
  "1-bed": 4,
  "2-bed": 4,
  "3-bed": 6,
  "4-plus": 6,
};

const propertyTruckMap = {
  studio: "Medium",
  "1-bed": "Small",
  "2-bed": "Medium",
  "3-bed": "Large",
  "4-plus": "Large",
};

function calculateTotals(updated) {
  const nextServices = Object.keys(updated).reduce((acc, key) => {
    acc[key] = { ...updated[key] };
    return acc;
  }, {});

  let subtotal = 0;

  Object.keys(nextServices).forEach((key) => {
    const rate = Number(nextServices[key].rate || 0);
    const quantity = Number(nextServices[key].quantity || 0);

    nextServices[key].total = rate * quantity;

    if (key !== "tax") {
      subtotal += nextServices[key].total;
    }
  });

  nextServices.tax.total = subtotal * (Number(nextServices.tax.rate || 0) / 100);

  return {
    services: nextServices,
    grandTotal: subtotal + nextServices.tax.total,
  };
}

export default function AdminPriceEstimator() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [quote, setQuote] = useState(null);
  const [services, setServices] = useState(EMPTY_SERVICES);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    const fetchQuote = async () => {
      const data = await getQuote(id);
      setQuote(data);

      const suggestedWorkers = propertyWorkerMap[data.propertySize] || 2;
      const defaultSpecialItems =
        (data.specialItemsList?.length || 0) + (data.customItems?.length || 0);

      if (data.invoice?.services?.length) {
        const prefilled = data.invoice.services.reduce((acc, service) => {
          acc[service.name] = {
            rate: service.rate ?? "",
            quantity: service.quantity ?? "",
            total: service.total ?? 0,
          };
          return acc;
        }, {});

        const seededServices = {
          ...EMPTY_SERVICES,
          distance: {
            ...EMPTY_SERVICES.distance,
            quantity: data.distanceKm || "",
          },
          labor: {
            ...EMPTY_SERVICES.labor,
            quantity: suggestedWorkers,
          },
          truck: {
            ...EMPTY_SERVICES.truck,
            quantity: 1,
          },
          driver: {
            ...EMPTY_SERVICES.driver,
            quantity: 1,
          },
          specialItems: {
            ...EMPTY_SERVICES.specialItems,
            quantity: defaultSpecialItems,
          },
          ...prefilled,
        };

        const calculated = calculateTotals(seededServices);
        setServices(calculated.services);
        setGrandTotal(calculated.grandTotal);
        return;
      }

      const initialServices = {
        ...EMPTY_SERVICES,
        distance: {
          ...EMPTY_SERVICES.distance,
          quantity: data.distanceKm || "",
        },
        labor: {
          ...EMPTY_SERVICES.labor,
          quantity: suggestedWorkers,
        },
        truck: {
          ...EMPTY_SERVICES.truck,
          quantity: 1,
        },
        driver: {
          ...EMPTY_SERVICES.driver,
          quantity: 1,
        },
        specialItems: {
          ...EMPTY_SERVICES.specialItems,
          quantity: defaultSpecialItems,
        },
      };

      const calculated = calculateTotals(initialServices);
      setServices(calculated.services);
      setGrandTotal(calculated.grandTotal);
    };

    fetchQuote();
  }, [id]);

  const updateField = (service, field, value) => {
    const calculated = calculateTotals({
      ...services,
      [service]: {
        ...services[service],
        [field]: value,
      },
    });

    setServices(calculated.services);
    setGrandTotal(calculated.grandTotal);
  };

  const handleSaveQuote = async () => {
    try {
      const servicesArray = Object.keys(services).map((key) => ({
        name: key,
        rate: Number(services[key].rate || 0),
        quantity: Number(services[key].quantity || 0),
        total: Number(services[key].total || 0),
      }));

      await updateInvoice(id, {
        services: servicesArray,
        tax: services.tax.rate,
      });

      alert(
        quote.invoice?.services?.length
          ? "Quote price updated successfully"
          : "Quote sent to customer successfully",
      );

      navigate(`/admin/quotes/${id}`);
    } catch (error) {
      alert(error.message);
    }
  };

  if (!quote) {
    return <div className="p-10">Loading...</div>;
  }

  const hasExistingInvoice = Boolean(quote.invoice?.services?.length);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {hasExistingInvoice ? "View or Update Price" : "Price Estimator"}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
          >
            Back
          </button>
        </div>

        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <p className="text-slate-600">
            <span className="font-semibold text-slate-800">From:</span>{" "}
            {quote.fromLocation || quote.zipFrom}
            <br />
            <span className="font-semibold text-slate-800">To:</span>{" "}
            {quote.toLocation || quote.zipTo}
          </p>

          <p className="mb-4 text-slate-600">
            <span className="font-semibold text-slate-800">Distance:</span>{" "}
            {quote.distanceKm} km
          </p>
        </div>

        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <p className="mb-3 font-semibold text-slate-800">
            Property Size: {quote.propertySize}
          </p>

          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-800">
              Suggested Workers:
            </span>{" "}
            {propertyWorkerMap[quote.propertySize]}
          </p>

          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-800">
              Suggested Truck:
            </span>{" "}
            {propertyTruckMap[quote.propertySize]}
          </p>
        </div>

        <div className="rounded-xl bg-white shadow">
          <table className="w-full">
            <thead className="border-b bg-slate-50">
              <tr className="text-left text-slate-600">
                <th className="p-4">Service</th>
                <th className="p-4">Charge / Unit</th>
                <th className="p-4 text-center">Units / Workers</th>
                <th className="p-4 text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              <ServiceRow
                label="Distance"
                unit="per km"
                service="distance"
                services={services}
                updateField={updateField}
              />
              <ServiceRow
                label="Packing + Loading + Unloading"
                unit="per student"
                service="labor"
                services={services}
                updateField={updateField}
              />
              <ServiceRow
                label="Truck Rent"
                unit="per truck"
                service="truck"
                services={services}
                updateField={updateField}
              />
              <ServiceRow
                label="Driver"
                unit="per driver"
                service="driver"
                services={services}
                updateField={updateField}
              />
              <ServiceRow
                label="Special Item Handling"
                unit="per item"
                service="specialItems"
                services={services}
                updateField={updateField}
              />
              <ServiceRow
                label="Tax (%)"
                service="tax"
                services={services}
                updateField={updateField}
              />
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t bg-slate-50 p-6">
            <p className="text-sm text-slate-500">
              Total is calculated automatically from the values entered above.
            </p>

            <div className="text-right">
              <p className="text-sm text-slate-500">Total Price Including Tax</p>
              <p className="text-3xl font-bold text-green-600">
                Rs. {grandTotal}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSaveQuote}
            className="rounded-lg bg-blue-600 px-6 py-3 text-white shadow hover:bg-blue-700"
          >
            {hasExistingInvoice ? "Update Quote Price" : "Send Quote to Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ServiceRow({ label, service, services, updateField, unit }) {
  const row = services[service];

  return (
    <tr className="border-t transition hover:bg-slate-50">
      <td className="p-4 font-medium text-slate-700">{label}</td>

      <td className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Rs.</span>
          <input
            type="number"
            value={row.rate}
            onChange={(event) => updateField(service, "rate", event.target.value)}
            className="w-24 rounded-lg border px-3 py-2 text-center"
          />
          {unit && (
            <span className="whitespace-nowrap text-xs text-slate-500">
              {unit}
            </span>
          )}
        </div>
      </td>

      <td className="p-4 text-center">
        <input
          type="number"
          value={row.quantity}
          onChange={(event) => updateField(service, "quantity", event.target.value)}
          className="w-20 rounded-lg border px-3 py-2 text-center"
        />
      </td>

      <td className="p-4 text-right font-semibold text-slate-800">
        Rs. {row.total}
      </td>
    </tr>
  );
}
