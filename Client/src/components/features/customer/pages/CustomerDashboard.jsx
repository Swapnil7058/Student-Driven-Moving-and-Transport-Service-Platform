import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { getCustomersQuotes } from "../services/customerQuoteService";
import DashboardStats from "../components/dashboard/DashboardStats";
import InProgressMovesSection from "../components/dashboard/InProgressMovesSection";
import UpcomingMoveSection from "../components/dashboard/UpcomingMoveSection";
import SupportSection from "../components/dashboard/SupportSection";
import { socket } from "../../../../socket-connection/socket";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [notice, setNotice] = useState(null);
  const { user } = useAuth();
  const customerEmail = user?.email;

  useEffect(() => {
    if (!customerEmail) return;

    const fetchQuotes = async () => {
      try {
        const data = await getCustomersQuotes(customerEmail);
        setQuotes(data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      }
    };

    fetchQuotes();
  }, [customerEmail]);

  useEffect(() => {
    const showNotice = (text) => {
      setNotice(text);
      setTimeout(() => setNotice(null), 3000);
    };

    const handleQuoteChanged = async (payload) => {
      if (!customerEmail) return;
      if (payload.email && payload.email !== customerEmail) return;

      try {
        const data = await getCustomersQuotes(customerEmail);
        setQuotes(data);
      } catch (error) {
        console.error("Dashboard refresh error:", error);
      }
    };

    const handleProgressUpdated = (payload) => {
      setQuotes((currentQuotes) =>
        currentQuotes.map((quote) =>
          String(quote._id) === String(payload.quoteId)
            ? { ...quote, status: payload.status }
            : quote,
        ),
      );

      if (payload.status === "completed") {
        showNotice(
          "Your move is completed! Please check your dashboard for details.",
        );
      } else {
        showNotice(
          `Your move status is updated to "${payload.status}". Please check your dashboard for details.`,
        );
      }
    };

    const handleStudentAccepted = (payload) => {
      setQuotes((currentQuotes) =>
        currentQuotes.map((quote) =>
          String(quote._id) === String(payload.quoteId)
            ? { ...quote, status: payload.status }
            : quote,
        ),
      );

      showNotice(
        `Student Assigned: ${payload.acceptedCount}/${payload.requiredStudents}`,
      );
    };

    socket.on("quote:changed", handleQuoteChanged);
    socket.on("job:progressUpdated", handleProgressUpdated);
    socket.on("job:studentAccepted", handleStudentAccepted);

    return () => {
      socket.off("quote:changed", handleQuoteChanged);
      socket.off("job:progressUpdated", handleProgressUpdated);
      socket.off("job:studentAccepted", handleStudentAccepted);
    };
  }, [customerEmail]);

  const latestUpcomingQuote = quotes.find((quote) =>
    ["pending", "quoted", "confirmed"].includes(quote.status),
  );

  const statusCount = quotes.reduce(
    (acc, quote) => {
      acc[quote.status] = (acc[quote.status] || 0) + 1;
      return acc;
    },
    {
      pending: 0,
      confirmed: 0,
      "in-progress": 0,
      completed: 0,
    },
  );

  const stats = [
    {
      title: "Upcoming Move",
      value: latestUpcomingQuote?.moveDate || "-",
      color: "",
    },
    {
      title: "Pending",
      value: statusCount.pending,
      color: "text-yellow-500",
    },
    {
      title: "In Progress",
      value: statusCount["in-progress"],
      color: "text-blue-500",
    },
    {
      title: "Completed",
      value: statusCount.completed,
      color: "text-green-500",
    },
  ];

  return (
    <>
      {notice && (
        <div className="fixed top-4 right-4 z-50 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 shadow-lg">
          {notice}
        </div>
      )}

      <main className="flex-1 p-6">
        <DashboardStats stats={stats} />
        <UpcomingMoveSection quote={latestUpcomingQuote} />
        <InProgressMovesSection quotes={quotes} />

        <SupportSection
          onSupportClick={() => navigate("/customer/support")}
          onFaqClick={() => navigate("/customer/faqs")}
        />

        <button
          onClick={() => navigate("/customer/quote")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Request New Move Quote
        </button>
      </main>
    </>
  );
}
