import { motion } from "framer-motion";

export default function StepCustomerInfo({ formData, handleChange }) {

  return (
    <motion.div
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -80, opacity: 0 }}
      className="grid md:grid-cols-2 gap-6"
    >

      <input
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        className="border-b py-2"
      />

      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border-b py-2"
      />

      <input
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        className="border-b py-2"
      />

    </motion.div>
  );
}