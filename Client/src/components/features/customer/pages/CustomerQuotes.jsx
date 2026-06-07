import { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { getCustomersQuotes } from "../services/customerQuoteService";
import RecentMovesSection from "../components/dashboard/RecentMovesSection";

export default function CustomerQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const customerEmail = user?.email;

  useEffect(() => {
    if (!customerEmail) return;

    const fetchQuotes = async () => {
      try {
        const data = await getCustomersQuotes(customerEmail);
        setQuotes(data);
      } catch (error) {
        console.error("Quotes fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuotes();
  }, [customerEmail]);

  return (
    <main className="flex-1 p-6">
      <section className="bg-white rounded-xl shadow p-6 mb-8">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">My Quotes</h1>
        <p className="text-slate-600">Review your recent move requests and statuses.</p>
      </section>

      <RecentMovesSection quotes={quotes} isLoading={isLoading} />
    </main>
  );
}
