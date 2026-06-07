import { Mail, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { response } from "../../../../hooks/support.logic";

export default function CustomerSupport() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      alert("Please fill all the fields");
      return;
    }

    try {
      setLoading(true);
      
      await response(form);

      alert("Message sent successfully ✅");

      setForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      alert("Failed to send message ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800">Contact Support</h1>
          <p className="text-slate-500 mt-2">
            Need help with your move? We’re here for you.
          </p>
        </div>

        {/* SUPPORT OPTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 border rounded-xl text-center hover:shadow-md transition">
            <Phone className="mx-auto text-blue-600 mb-3" size={32} />
            <h3 className="font-semibold text-slate-700">Call Us</h3>
            <p className="text-sm text-slate-500 mt-1">
              Speak directly with support
            </p>
            <p className="font-semibold text-blue-600 mt-2">(800) 484-1116</p>
          </div>

          <div className="p-6 border rounded-xl text-center hover:shadow-md transition">
            <Mail className="mx-auto text-green-600 mb-3" size={32} />
            <h3 className="font-semibold text-slate-700">Email Support</h3>
            <p className="text-sm text-slate-500 mt-1">
              We reply within 24 hours
            </p>
            <p className="font-semibold text-green-600 mt-2">
              support@vanman.com
            </p>
          </div>

          <div className="p-6 border rounded-xl text-center hover:shadow-md transition">
            <MessageCircle className="mx-auto text-purple-600 mb-3" size={32} />
            <h3 className="font-semibold text-slate-700">Raise a Ticket</h3>
            <p className="text-sm text-slate-500 mt-1">
              Track your issue online
            </p>
            <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Create Ticket
            </button>
          </div>
        </div>

        {/* QUICK CONTACT FORM */}
        <div className="bg-slate-50 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">
            Quick Message
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Describe your issue..."
            rows="4"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Sending..." : "Sent Message"}
          </button>
        </div>

        {/* FOOTER NOTE */}
        <div className="text-center text-sm text-slate-500 mt-6">
          Our support team is available Mon–Sat, 9AM–7PM
        </div>
      </div>
    </div>
  );
}
