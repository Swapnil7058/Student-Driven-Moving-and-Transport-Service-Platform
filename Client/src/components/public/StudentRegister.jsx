import { useEffect, useMemo, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { isValidPhoneNumber } from "react-phone-number-input";
import { API_BASE_URL } from "../../config/api";

export default function StudentRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    whatsapp: "",
    college: "",
    roles: "",
  });
  const [studentId, setStudentId] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [whatsappError, setWhatsappError] = useState("");

  const searchParams = useMemo(
    () => new URLSearchParams(window.location.search),
    [],
  );
  const verifyEmailToken = searchParams.get("verifyEmailToken") || "";

  useEffect(() => {
    const verifyEmail = async () => {
      if (!verifyEmailToken) return;
      const res = await fetch(
        `${API_BASE_URL}/students/verify-email?token=${verifyEmailToken}`,
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("Email verified successfully for student registration.");
      } else {
        setError(data.message || "Student email verification failed.");
      }
    };

    verifyEmail();
  }, [verifyEmailToken]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const payload = { ...form, age: Number(form.age) };
    const res = await fetch(`${API_BASE_URL}/students/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      setError(data.message || "Registration failed");
      return;
    }

    const newStudentId = data?.data?.studentId || "";
    setStudentId(newStudentId);
    setMessage(
      `Registration successful! Student ID: ${newStudentId}. Verify OTP and email.`,
    );
  };

  const handleResendOtp = async () => {
    setError("");
    setMessage("");
    if (!studentId) {
      setError("Register first to get Student ID.");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/students/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId }),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      setError(data.message || "Failed to resend OTP");
      return;
    }

    setMessage("OTP sent successfully.");
  };

  const handleVerifyOtp = async () => {
    setError("");
    setMessage("");
    if (!studentId || !otp) {
      setError("Student ID and OTP are required.");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/students/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, otp }),
    });
    const data = await res.json();

    if (!res.ok || !data.success) {
      setError(data.message || "Failed to verify OTP");
      return;
    }

    setMessage("Student OTP verified successfully.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Student Registration
        </h1>

        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="Full Name"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          placeholder="Email"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="number"
          value={form.age}
          onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
          placeholder="Age"
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="text"
          value={form.college}
          onChange={(e) => setForm((p) => ({ ...p, college: e.target.value }))}
          placeholder="College Name"
          className="w-full p-3 border rounded-lg"
          required
        />

        <div className="border rounded-lg p-2">
          <PhoneInput
            international
            defaultCountry="IN"
            value={form.phone}
            onChange={(value) => {
              setForm((p) => ({ ...p, phone: value || "" }));
              setPhoneError(
                value && isValidPhoneNumber(value) ? "" : "Invalid phone number",
              );
            }}
            placeholder="Phone Number"
          />
        </div>
        {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}

        <div className="border rounded-lg p-2">
          <PhoneInput
            international
            defaultCountry="IN"
            value={form.whatsapp}
            onChange={(value) => {
              setForm((p) => ({ ...p, whatsapp: value || "" }));
              setWhatsappError(
                value && isValidPhoneNumber(value)
                  ? ""
                  : "Invalid WhatsApp number",
              );
            }}
            placeholder="WhatsApp Number"
          />
        </div>
        {whatsappError && <p className="text-sm text-red-500">{whatsappError}</p>}

        <select
          value={form.roles}
          onChange={(e) => setForm((p) => ({ ...p, roles: e.target.value }))}
          className="w-full p-3 border rounded-lg"
          required
        >
          <option value="">Preferred Role</option>
          <option value="packing">Packing</option>
          <option value="loading/unloading">Loading / Unloading</option>
          <option value="driving">Driving</option>
        </select>

        <button
          type="submit"
          disabled={Boolean(phoneError || whatsappError)}
          className="w-full py-3 rounded-lg bg-black text-white disabled:opacity-60"
        >
          Register
        </button>

        <div className="border-t pt-4 space-y-3">
          <p className="text-sm font-medium text-slate-700">OTP Verification</p>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value.toUpperCase())}
            placeholder="Student ID"
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full p-3 border rounded-lg"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="py-2 rounded-lg bg-emerald-600 text-white"
            >
              Verify OTP
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              className="py-2 rounded-lg bg-slate-700 text-white"
            >
              Resend OTP
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Verify OTP and also click the email verification link received in
            your email.
          </p>
        </div>

        {message && <p className="text-sm text-green-600">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
