import { useState } from "react";
import StudentList from "../components/StudentList";

const AdminStudents = () => {
  const [activeTab, setActiveTab] = useState("pending");

  const tabs = ["pending", "approved", "rejected", "blocked"];

  return (
    <div>
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 capitalize ${
              activeTab === tab ? "border-b-2 border-black" : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <StudentList status={activeTab} />
    </div>
  );
};

export default AdminStudents;