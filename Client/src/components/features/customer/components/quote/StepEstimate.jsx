import { motion } from "framer-motion";
import SpecialItemsSelector from "./SpeccialItemsSelector";

export default function StepEstimate({ formData, handleChange, setFormData }) {

  return (
    <motion.div
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -80, opacity: 0 }}
      className="space-y-6"
    >

      <input
        type="date"
        name="moveDate"
        value={formData.moveDate}
        onChange={handleChange}
        className="border-b py-2 w-full"
      />

      <select
        name="propertySize"
        value={formData.propertySize}
        onChange={handleChange}
        className="border-b py-2 w-full"
      >
        <option value="">Property Size</option>
        <option value="studio">Studio</option>
        <option value="1-bed">1 Bedroom</option>
        <option value="2-bed">2 Bedroom</option>
        <option value="3-bed">3 Bedroom</option>
      </select>

      <SpecialItemsSelector
        formData={formData}
        setFormData={setFormData}
      />

    </motion.div>
  );
}