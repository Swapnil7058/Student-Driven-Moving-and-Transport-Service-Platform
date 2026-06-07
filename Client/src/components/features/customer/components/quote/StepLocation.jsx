import { motion } from "framer-motion";

export default function StepLocation({ formData, handleChange }) {

  return (
    <motion.div
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -80, opacity: 0 }}
      className="grid md:grid-cols-2 gap-6"
    >

      <input
        name="zipFrom"
        placeholder="Moving From Zip Code"
        value={formData.zipFrom}
        onChange={handleChange}
        className="border-b py-2"
      />

      <input
        name="zipTo"
        placeholder="Moving To Zip Code"
        value={formData.zipTo}
        onChange={handleChange}
        className="border-b py-2"
      />

    </motion.div>
  );
}