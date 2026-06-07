import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../../../../config/api";

// Student details card
const StudentDetails = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/students/${studentId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStudent(data.data);
        }
      });
  }, [studentId]);

  if (!student) return <p>Loading...</p>;

  return (
    <>
      {student.status === "approved" && (
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-sm text-blue-600"
          >
            ← Back
          </button>

          <h2 className=" text-2xl font-semibold mb-6">{student.name}</h2>

          <div className=" grid grid-cols-2 gap-6">
            {/* Basic info */}
            <div className="space-y-2">
              <p>
                <strong>ID:</strong>
                {student.studentId}
              </p>
              <p>
                <strong>Email:</strong>
                {student.email}
              </p>
              <p>
                <strong>Phone:</strong>
                {student.phone}
              </p>
              <p>
                <strong>WhatsApp:</strong>
                {student.whatsapp}
              </p>
              <p>
                <strong>Age:</strong>
                {student.age}
              </p>
              <p>
                <strong>College:</strong>
                {student.college}
              </p>
              <p>
                <strong>Status:</strong>
                {student.status}
              </p>
            </div>

            <div className=" space-y-3">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className=" text-sm text-gray-500">Total Jobs Completed</p>
                <p className=" text-xl font-bold">{student.totalJobs || 0}</p>
              </div>

              {student.currentJob && (
                <div className=" bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500"> Current Job</p>
                  <p className="font-semibold">{student.currentJob.title}</p>

                  <button
                    onClick={() =>
                      navigate(`/admin/jobs/${student.currentJob._id}`)
                    }
                    className=" text-blue-600 text-sm mt-2"
                  >
                    View Job Details →
                  </button>
                </div>
              )}

              <div className=" bg-gray-100 p-4 rounded-lg">
                <p className=" text-sm text-gray-500"> Roles Worked On</p>
                <div className=" flex gap-2 flex-wrap mt-2">
                  {student.rolesWorked?.map((role, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-black text-white text-xs rounded-full"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentDetails;
