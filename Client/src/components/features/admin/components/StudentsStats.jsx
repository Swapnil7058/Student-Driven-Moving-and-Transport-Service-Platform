import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { socket } from "../../../../socket-connection/socket";
import { API_BASE_URL } from "../../../../config/api";

const StudentsStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/students/stats/summary`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Student stats fetch error:", error);
      }
    };

    fetchStats();

    const refresh = () => {
      fetchStats();
    };

    socket.on("student:statsChanged", refresh);

    return () => {
      socket.off("student:statsChanged", refresh);
    };
  }, []);

  if (!stats) {
    return <p>Loading...</p>;
  }

  const cards = [
    {
      title: "Total Student",
      value: stats.total,
      color: "text-blue-500",
    },
    {
      title: "Pending Students",
      value: stats.pending,
      color: "text-yellow-500",
    },
    {
      title: "On Job",
      value: stats.onJob,
      color: "text-purple-500",
    },
    {
      title: "Available",
      value: stats.available,
      color: "text-emerald-600",
    },
  ];

  return (
    <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
};

export default StudentsStats;
