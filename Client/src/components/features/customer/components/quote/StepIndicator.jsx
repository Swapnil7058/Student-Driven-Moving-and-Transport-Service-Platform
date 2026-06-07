import { Check } from "lucide-react";
import { motion } from "framer-motion";

export default function StepIndicator({ steps, currentStep }) {

  return (
    <div className="flex justify-between mb-10 relative">

      <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200"></div>

      {steps.map((s) => (

        <div key={s.id} className="flex flex-col items-center z-10">

          <motion.div
            animate={{ scale: s.id === currentStep ? 1.2 : 1 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white
              ${
                s.id < currentStep
                  ? "bg-green-500"
                  : s.id === currentStep
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
          >
            {s.id < currentStep ? <Check size={18} /> : s.id}
          </motion.div>

          <span className="text-xs mt-2">{s.title}</span>

        </div>

      ))}

    </div>
  );
}