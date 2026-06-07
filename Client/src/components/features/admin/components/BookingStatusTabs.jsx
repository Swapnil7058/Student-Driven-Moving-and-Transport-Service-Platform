import { motion } from "framer-motion";

export default function BookingStatusTabs({ active, onChange }) {
  const tabs = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Quoted", value: "quoted" },
    { label: "Confirmed", value: "confirmed" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
{ label: "Rejected", value: "rejected" },  ];

  return (
    <div className="flex gap-2 flex-wrap mb-4">
      {tabs.map((tab, i) => (
        <motion.button
          key={tab.value}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition
                ${
                  active === tab.value
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 border hover:bg-slate-100"
                }`}
        >
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
}
