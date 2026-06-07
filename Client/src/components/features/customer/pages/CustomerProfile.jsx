import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

export default function CustomerProfile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
  });

  useEffect(() => {
    if (user?.role !== "customer") {
      return;
    }

    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      whatsapp: user?.whatsapp || "",
    });
  }, [user]);

  if (user?.role !== "customer") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        whatsapp: user?.whatsapp || "",
      });
      setMessage("");
    }

    setIsEditing((current) => !current);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      setMessage("");
      await updateProfile(formData);
      setIsEditing(false);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex-1 p-6">
      <section className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              My Profile
            </h1>
            <p className="mt-1 text-slate-500">
              Manage your account details used for bookings and quote requests.
            </p>
          </div>

          <button
            type="button"
            onClick={handleEditToggle}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
              isEditing
                ? "bg-slate-500 hover:bg-slate-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <ProfileField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <ProfileField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <ProfileField
            label="Contact Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <ProfileField
            label="WhatsApp Number"
            name="whatsapp"
            type="tel"
            value={formData.whatsapp}
            onChange={handleChange}
            disabled={!isEditing}
          />

          {message && (
            <p
              className={`text-sm ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          {isEditing && (
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </section>
    </main>
  );
}

function ProfileField({
  label,
  name,
  value,
  onChange,
  disabled,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-lg border px-4 py-3 ${
          disabled
            ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500"
            : "border-slate-300 bg-white"
        }`}
      />
    </div>
  );
}
