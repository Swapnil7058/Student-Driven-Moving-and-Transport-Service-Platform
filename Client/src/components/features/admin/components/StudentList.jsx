import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../../../config/api";

const StudentList = ({ status }) => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoadig] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoadig(true);
      const res = await fetch(
        `${API_BASE_URL}/students?status=${status}&search=${search}&page=${page}&limit=10`,
        { credentials: "include" },
      );

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();

      setStudents(data.data || []);
      setTotalPages(data.pages);
    } catch (err) {
      console.error(err);
      setStudents([]);
    } finally {
      setLoadig(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchStudents();
    }, 400);

    return () => clearTimeout(delay);
  }, [status, search, page]);

  useEffect(() => {
    setPage(1);
  }, [status, search]);

  const updateStatus = async (studentId, newStatus) => {
    await fetch(`${API_BASE_URL}/students/${studentId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: newStatus }),
    });

    fetchStudents();
  };

  return (
    <div className=" bg-white p-6 rounded-2xl shadow-lg">
      {/* Header */}
      <div className=" flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold capitalize">{status} Students</h2>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className=" border mb-1 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className=" text-center py-4">Loading...</p>
      ) : (
        <div className=" ">
          <table className="w-full text-sm">
            <thead className=" bg-slate-700 text-white">
              <tr>
                <th className=" p-3 text-left">ID</th>
                <th className=" p-3 text-left">Name</th>
                <th className=" p-3 text-left">Role</th>
                <th className=" p-3 text-left">Status</th>
                <th className=" p-3 text-left">Action</th>
              </tr>
            </thead>

            <motion.tbody
              key={page}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {students.length > 0 ? (
                students.map((student) => (
                  <motion.tr
                    key={student._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={
                      student.status === "approved" &&
                      (() => {
                        navigate(`/admin/students/${student.studentId}`);
                      })
                    }
                    className="border-b hover:bg-slate-200 transition"
                  >
                    <td className=" p-3">{student.studentId}</td>
                    <td className=" p-3">{student.name}</td>
                    <td className=" p-3 capitalize">{student.roles}</td>
                    <td className=" p-3">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          student.status === "approved"
                            ? "bg-green-100 text-green-600"
                            : student.status === "rejected"
                              ? "bg-red-100 text-red-600"
                              : student.status === "pending"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-black text-white"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>

                    <td className=" p-3 space-x-2">
                      {student.status === "pending" && (
                        <>
                          <button
                            onClick={() => {
                              updateStatus(student.studentId, "approved");
                            }}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => {
                              updateStatus(student.studentId, "rejected");
                            }}
                            className=" bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {student.status === "approved" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(student.studentId, "blocked");
                          }}
                          className=" bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-xs"
                        >
                          Block
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className=" text-center p-4 text-gray-500">
                    No students found
                  </td>
                </tr>
              )}
            </motion.tbody>
          </table>

          <motion.div
            className=" flex justify-center items-center gap-2 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Prev Button */}
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className={`px-3 py-1 rounded ${
                page === 1
                  ? " bg-gray-200 text-gray-400 cursor-not-allowed"
                  : " bg-gray-100 hover:bg-black hover:text-white"
              }`}
            >
              Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  page === i + 1
                    ? "bg-black text-white"
                    : "bg-gray-100 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </motion.button>
            ))}

            {/* Next */}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className={`px-3 py-1 rounded ${
                page === totalPages
                  ? " bg-gray-200 text-gray-400 cursor-not-allowed"
                  : " bg-gray-100 hover:bg-black hover:text-white"
              }`}
            >
              Next
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
