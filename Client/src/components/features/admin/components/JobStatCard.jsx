import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { socket } from "../../../../socket-connection/socket";
import { API_BASE_URL } from "../../../../config/api";

export default function JobStatCard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/quotes/stats/summary`,
          { credentials: "include" },
        );
        const data = await res.json();

        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Stats error:", err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/quotes/stats/summary`,
          { credentials: "include" },
        );
        const data = await res.json();

        if (data.success) setStats(data.data);
      } catch (err) {
        console.error("Stats error:", err);
      }
    };

    fetchStats();

    const refresh = () => fetchStats();

    socket.on("quote:changed", refresh);
    socket.on("job:progressUpdated", refresh);
    socket.on("job:studentAccepted", refresh);

    return () => {
      socket.off("quote:changed", refresh);
      socket.off("job:progressUpdated", refresh);
      socket.off("job:studentAccepted", refresh);
    };
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  const cards = [
    {
      title: "Total Bookings",
      value: stats.totalJobs,
      color: "text-blue-500",
    },
    {
      title: "Pending Requests",
      value: stats.pending,
      color: "text-yellow-500",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      color: "text-purple-500",
    },
    {
      title: "Completed",
      value: stats.completed,
      color: "text-green-500",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.revenue.toLocaleString()}`,
      color: "text-emerald-600",
    },
  ];

  return (
    // <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
    //   {cards.map((card, i) => (
    //     <motion.div
    //       key={i}
    //       initial={{ opacity: 0, y: 15 }}
    //       animate={{ opacity: 1, y: 0 }}
    //       transition={{ delay: i * 0.1 }}
    //       className="bg-white p-6 rounded-xl shadow"
    //     >
    //       <h3 className="text-sm text-slate-500 uppercase tracking-wide">
    //         {card.title}
    //       </h3>
    //       <p className={`text-3xl font-bold mt-2 ${card.color}`}>
    //         {card.value}
    //       </p>
    //     </motion.div>
    //   ))}
    // </div>

    <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={` text-sm p-6 rounded-xl shadow-lg ${card.color}`}
        >
          <h3 className=" text-sm uppercase tracking-wide">{card.title}</h3>
          <p className=" text-3xl font-bold mt-2">{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
