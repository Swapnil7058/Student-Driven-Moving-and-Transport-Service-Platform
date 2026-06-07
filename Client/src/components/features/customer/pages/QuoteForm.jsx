import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import StepIndicator from "../components/quote/StepIndicator";
import StepLocation from "../components/quote/StepLocation";
import StepCustomerInfo from "../components/quote/StepCustomerInfo";
import StepEstimate from "../components/quote/StepEstimate";
import FormNavigation from "../components/quote/FormNavigation";

import { response } from "../hooks/quote.logic";

const steps = [
  { id: 1, title: "LOCATION", fields: ["zipFrom", "zipTo"] },
  { id: 2, title: "INFO", fields: ["fullName", "email", "phone"] },
  { id: 3, title: "ESTIMATE", fields: ["moveDate", "propertySize"] },
];

export default function QuoteForm() {

  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    zipFrom: "",
    zipTo: "",
    fullName: "",
    email: "",
    phone: "",
    moveDate: "",
    propertySize: "",
    hasSpecialItems: "no",
    specialItemsList: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validateStep = () => {
    const step = steps.find((s) => s.id === currentStep);
    return step.fields.every((f) => formData[f]);
  };

  const handleNext = () => {
    if (!validateStep()) return alert("Please fill required fields");
    setCurrentStep((p) => p + 1);
  };

  const handleBack = () => setCurrentStep((p) => p - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep()) return;

    try {
      await response(formData);

      alert("Quote Submitted Successfully");

      navigate("/customer/dashboard");
    } catch {
      alert("Failed to submit quote");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-200 p-6">


      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl w-full max-w-4xl p-10"
      >

        <StepIndicator steps={steps} currentStep={currentStep} />

        <form onSubmit={handleSubmit}>

          <AnimatePresence mode="wait">

            {currentStep === 1 && (
              <StepLocation
                formData={formData}
                handleChange={handleChange}
              />
            )}

            {currentStep === 2 && (
              <StepCustomerInfo
                formData={formData}
                handleChange={handleChange}
              />
            )}

            {currentStep === 3 && (
              <StepEstimate
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
              />
            )}

          </AnimatePresence>

          <FormNavigation
            currentStep={currentStep}
            steps={steps}
            handleNext={handleNext}
            handleBack={handleBack}
          />

        </form>

      </motion.div>

    </div>
  );
}