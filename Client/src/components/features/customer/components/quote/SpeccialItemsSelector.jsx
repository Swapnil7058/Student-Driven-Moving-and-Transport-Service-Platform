import { Sofa, Piano, Box, Info } from "lucide-react";
import { motion } from "framer-motion";

const ITEMS = [
  { name: "Piano/Organ", icon: Piano },
  { name: "Large Safe", icon: Box },
  { name: "Pool Table", icon: Sofa },
  { name: "Artwork/Sculpture", icon: Info },
  { name: "Other", icon: Info },
];

export default function SpecialItemsSelector({ formData, setFormData }) {

  const toggleItem = (name) => {

    const exists = formData.specialItemsList.includes(name);

    const updated = exists
      ? formData.specialItemsList.filter((i) => i !== name)
      : [...formData.specialItemsList, name];

    setFormData({ ...formData, specialItemsList: updated });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

      {ITEMS.map((item) => {

        const selected = formData.specialItemsList.includes(item.name);

        return (
          <motion.div
            whileTap={{ scale: 0.9 }}
            key={item.name}
            onClick={() => toggleItem(item.name)}
            className={`p-3 border rounded-lg text-center cursor-pointer
            ${selected ? "bg-blue-100 border-blue-500" : "hover:bg-gray-50"}
            `}
          >
            <item.icon size={22} className="mx-auto mb-1" />
            <span className="text-xs">{item.name}</span>
          </motion.div>
        );

      })}

    </div>
  );
}