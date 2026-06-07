import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Sofa, Piano, Box, Info } from "lucide-react";
import { response } from "../../../../hooks/quotes.logic";
import { useAuth } from "../../../../context/AuthContext";

function getInitialFormData(user) {
  return {
    zipFrom: "",
    zipTo: "",
    fromAddressLine1: "",
    fromStreet: "",
    fromLandmark: "",
    toAddressLine1: "",
    toStreet: "",
    toLandmark: "",
    fullName: user?.name || user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    moveDate: "",
    propertySize: "",
    hasSpecialItems: "no",
    specialItemsList: [],
    customItemName: "",
    customItemInstructions: "",
    fragile: false,
  };
}

function FloatingInput({
  id,
  name,
  value,
  onChange,
  label,
  type = "text",
  required = false,
  readOnly = false,
  placeholder = "",
}) {
  return (
    <div className="relative flex-1 min-w-[220px] mt-4">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`w-full py-2 mt-4 border-b-2 focus:outline-none peer transition duration-300 ${
          readOnly
            ? "border-slate-300 bg-slate-50 text-slate-500 cursor-not-allowed"
            : "border-gray-300 focus:border-blue-500"
        }`}
      />
      <label
        htmlFor={id}
        className={`absolute left-0 transition-all duration-300 pointer-events-none ${
          value
            ? "text-xs -top-2 text-blue-500"
            : "bottom-2 text-base text-gray-500 peer-focus:text-xs peer-focus:-top-2 peer-focus:text-blue-500"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

const QuoteForm = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const initialFormData = useMemo(() => getInitialFormData(user), [user]);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fullName: initialFormData.fullName,
      email: initialFormData.email,
      phone: initialFormData.phone,
    }));
  }, [initialFormData]);

  const steps = [
    {
      id: 1,
      title: "LOCATION",
      fields: [
        "fromAddressLine1",
        "fromStreet",
        "zipFrom",
        "toAddressLine1",
        "toStreet",
        "zipTo",
      ],
    },
    { id: 2, title: "INFO", fields: ["fullName", "email", "phone"] },
    { id: 3, title: "ESTIMATE", fields: ["moveDate", "propertySize"] },
  ];

  const specialItems = [
    { name: "Piano/Organ", icon: Piano },
    { name: "Large Safe", icon: Box },
    { name: "Pool Table", icon: Sofa },
    { name: "Artwork/Sculpture", icon: Info },
    { name: "Other", icon: Info },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecialItemToggle = (event) => {
    setFormData((prev) => ({
      ...prev,
      hasSpecialItems: event.target.value,
      specialItemsList: event.target.value === "no" ? [] : prev.specialItemsList,
      customItemName: event.target.value === "no" ? "" : prev.customItemName,
      customItemInstructions:
        event.target.value === "no" ? "" : prev.customItemInstructions,
      fragile: event.target.value === "no" ? false : prev.fragile,
    }));
  };

  const handleSpecialItemSelection = (itemName) => {
    setFormData((prev) => {
      const updatedList = prev.specialItemsList.includes(itemName)
        ? prev.specialItemsList.filter((item) => item !== itemName)
        : [...prev.specialItemsList, itemName];

      return { ...prev, specialItemsList: updatedList };
    });
  };

  const validateStep = () => {
    const currentStepData = steps.find((step) => step.id === currentStep);

    return currentStepData.fields.every((field) => {
      const value = formData[field];
      return value && String(value).trim() !== "";
    });
  };

  const handleNext = () => {
    if (!validateStep()) {
      alert("Please fill out all required fields before proceeding.");
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateStep()) {
      alert("Please fill out all required fields before submitting.");
      return;
    }

    try {
      await response({
        ...formData,
        customItems: formData.customItemName
          ? [
              {
                name: formData.customItemName,
                instructions: formData.customItemInstructions,
                fragile: formData.fragile,
              },
            ]
          : [],
      });

      alert("Quote submitted successfully");
      setFormData(getInitialFormData(user));
      setCurrentStep(1);
      navigate("/customer/dashboard");
    } catch (error) {
      console.error("Failed to submit quote", error);
      alert("Failed to submit quote. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center">Loading your account...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl rounded-lg bg-white p-10 shadow-xl">
        <header className="mb-8 text-center">
          <h2 className="inline-block border-b-4 border-blue-600 pb-3 text-2xl font-bold text-gray-800 md:mx-44">
            REQUEST YOUR FREE QUOTE AND BOOK YOUR MOVE WITH US TODAY
          </h2>
          <p className="mt-3 text-gray-600">
            Fill out the form below to receive a no-obligation quote tailored to
            your needs.
          </p>
        </header>

        <div className="relative mb-12 flex items-start justify-between">
          <div className="absolute left-0 right-0 top-4 z-0 h-1 bg-gray-300"></div>

          {steps.map((step) => (
            <React.Fragment key={step.id}>
              <div
                className={`relative z-10 flex flex-col items-center transition duration-500 ${
                  step.id <= currentStep ? "text-blue-600" : "text-gray-500"
                }`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-4 font-bold text-white transition duration-500 ${
                    step.id < currentStep
                      ? "scale-110 border-green-500 bg-green-500"
                      : step.id === currentStep
                        ? "border-blue-600 bg-blue-600"
                        : "border-gray-300 bg-gray-300"
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check size={18} className="animate-pulse" />
                  ) : (
                    <span className="text-sm">{step.id}</span>
                  )}
                </div>
                <span className="mt-2 whitespace-nowrap text-xs font-medium">
                  {`${step.id}. ${step.title}`}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className="space-y-8">
              <section className="rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800">
                  Pickup Address
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the complete address for the move origin.
                </p>

                <div className="mt-4 flex flex-wrap gap-8">
                  <FloatingInput
                    id="fromAddressLine1"
                    name="fromAddressLine1"
                    value={formData.fromAddressLine1}
                    onChange={handleChange}
                    label="House / Flat / Building*"
                    required
                  />
                  <FloatingInput
                    id="fromStreet"
                    name="fromStreet"
                    value={formData.fromStreet}
                    onChange={handleChange}
                    label="Street / Area*"
                    required
                  />
                  <FloatingInput
                    id="fromLandmark"
                    name="fromLandmark"
                    value={formData.fromLandmark}
                    onChange={handleChange}
                    label="Landmark"
                  />
                  <FloatingInput
                    id="zipFrom"
                    name="zipFrom"
                    value={formData.zipFrom}
                    onChange={handleChange}
                    label="Pin Code*"
                    required
                  />
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800">
                  Drop Address
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the complete destination address.
                </p>

                <div className="mt-4 flex flex-wrap gap-8">
                  <FloatingInput
                    id="toAddressLine1"
                    name="toAddressLine1"
                    value={formData.toAddressLine1}
                    onChange={handleChange}
                    label="House / Flat / Building*"
                    required
                  />
                  <FloatingInput
                    id="toStreet"
                    name="toStreet"
                    value={formData.toStreet}
                    onChange={handleChange}
                    label="Street / Area*"
                    required
                  />
                  <FloatingInput
                    id="toLandmark"
                    name="toLandmark"
                    value={formData.toLandmark}
                    onChange={handleChange}
                    label="Landmark"
                  />
                  <FloatingInput
                    id="zipTo"
                    name="zipTo"
                    value={formData.zipTo}
                    onChange={handleChange}
                    label="Pin Code*"
                    required
                  />
                </div>
              </section>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Customer Information
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Name and email come from your account. You can update the contact
                  number for this quote if needed.
                </p>
              </div>

              <div className="flex flex-wrap gap-8">
                <FloatingInput
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  label="Full Name*"
                  required
                  readOnly
                />
                <FloatingInput
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  label="Email Address*"
                  type="email"
                  required
                  readOnly
                />
                <FloatingInput
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  label="Contact Number*"
                  type="tel"
                  required
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-wrap gap-8">
                <div className="relative mt-4 min-w-[220px] flex-1">
                  <label
                    htmlFor="moveDate"
                    className="absolute -top-4 left-0 mb-1 block text-sm text-gray-500"
                  >
                    Preferred Move Date*
                  </label>
                  <input
                    type="date"
                    id="moveDate"
                    name="moveDate"
                    value={formData.moveDate}
                    onChange={handleChange}
                    required
                    className="mt-4 w-full border-b-2 border-gray-300 bg-white py-2 transition duration-300 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="relative mt-4 min-w-[220px] flex-1">
                  <label
                    htmlFor="propertySize"
                    className="absolute -top-4 left-0 mb-1 block text-sm text-gray-500"
                  >
                    Size of Property*
                  </label>
                  <select
                    id="propertySize"
                    name="propertySize"
                    value={formData.propertySize}
                    onChange={handleChange}
                    required
                    className="mt-4 w-full appearance-none border-b-2 border-gray-300 bg-white py-2 transition duration-300 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="" disabled>
                      Select Size
                    </option>
                    <option value="studio">Studio</option>
                    <option value="1-bed">1 Bedroom</option>
                    <option value="2-bed">2 Bedroom</option>
                    <option value="3-bed">3 Bedroom</option>
                    <option value="4-plus">4+ Bedrooms</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-gray-200 p-4">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-700">
                  <Sofa size={20} className="mr-2 text-red-500" />
                  Do you have any special or bulky items?
                </h3>

                <div className="mb-4 flex gap-6">
                  <label className="flex cursor-pointer items-center space-x-2">
                    <input
                      type="radio"
                      name="hasSpecialItems"
                      value="yes"
                      checked={formData.hasSpecialItems === "yes"}
                      onChange={handleSpecialItemToggle}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">Yes</span>
                  </label>
                  <label className="flex cursor-pointer items-center space-x-2">
                    <input
                      type="radio"
                      name="hasSpecialItems"
                      value="no"
                      checked={formData.hasSpecialItems === "no"}
                      onChange={handleSpecialItemToggle}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-gray-700">No</span>
                  </label>
                </div>

                {formData.hasSpecialItems === "yes" && (
                  <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2 md:grid-cols-5">
                    {specialItems.map((item) => {
                      const isSelected = formData.specialItemsList.includes(
                        item.name,
                      );

                      return (
                        <div
                          key={item.name}
                          onClick={() => handleSpecialItemSelection(item.name)}
                          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border p-3 transition duration-200 ${
                            isSelected
                              ? "border-blue-500 bg-blue-100 ring-2 ring-blue-500"
                              : "border-gray-300 bg-white hover:bg-gray-50"
                          }`}
                        >
                          <item.icon
                            size={24}
                            className={isSelected ? "text-blue-600" : "text-gray-500"}
                          />
                          <span className="mt-1 text-center text-xs font-medium">
                            {item.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {formData.specialItemsList.includes("Other") && (
                  <div className="mt-6 space-y-3 border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Describe the special item
                    </h4>

                    <input
                      type="text"
                      placeholder="Item name"
                      value={formData.customItemName}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          customItemName: event.target.value,
                        })
                      }
                      className="w-full rounded-lg border px-3 py-2"
                    />

                    <textarea
                      placeholder="Handling instructions (optional)"
                      value={formData.customItemInstructions}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          customItemInstructions: event.target.value,
                        })
                      }
                      className="w-full rounded-lg border px-3 py-2"
                    />

                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.fragile}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            fragile: event.target.checked,
                          })
                        }
                      />
                      Fragile Item
                    </label>
                  </div>
                )}

                {formData.hasSpecialItems === "yes" && (
                  <p className="mt-2 text-xs text-red-500">
                    Selecting these items helps us prepare the right team and
                    handling requirements.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-12 flex justify-end gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-md bg-gray-500 px-6 py-2 font-semibold text-white transition hover:bg-gray-600"
              >
                Previous
              </button>
            )}

            {currentStep < steps.length && (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-md bg-blue-600 px-6 py-2 font-semibold text-white transition hover:bg-blue-700"
              >
                Next
              </button>
            )}

            {currentStep === steps.length && (
              <button
                type="submit"
                className="rounded-md bg-green-600 px-6 py-2 font-semibold text-white transition hover:bg-green-700"
              >
                Get Quote
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 text-center text-gray-700">
          Need help? Call now (800) 484-1116
        </div>
      </div>
    </div>
  );
};

export default QuoteForm;
