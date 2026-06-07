import React from "react";
import { useEffect, useState } from "react";

// import BookingTable from "./admin-component/BookingTable";
// import BookingStatusTabs from "./admin-component/BookingStatusTabs";
import BookingTable from "../components/BookingTable";
import BookingStatusTabs from "../components/BookingStatusTabs";
import Pagination from "../components/Pagination";
import BookingSkeleton from "../layout/BookingSkeleton";
import { API_BASE_URL } from "../../../../config/api";

const BookingSection = () => {
  const [bookings, setBookings] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [limit, setLimit] = useState(10);

  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/quotes?page=${page}&limit=${limit}&status=${activeStatus}&search=${debouncedSearch}`,
        { credentials: "include" },
      );

      const data = await res.json();
      //   const text = await res.text();   // Read raw responce first
      // console.log("RAW RESPONSE:", text);

      if (data.success) {
        setBookings(data.data);
        setPages(data.pages);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, activeStatus, debouncedSearch, limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className=" space-y-6">
      {/* FILTER TABS */}
      <BookingStatusTabs
        active={activeStatus}
        onChange={(status) => {
          setActiveStatus(status);
          setPage(1);
        }}
      />

      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded-lg text-sm w-64"
        />

        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border px-3 py-2 rounded-lg text-sm"
        >
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      {/* Booking Table */}
      {loading ? (
        <BookingSkeleton /> // for better UI when data is loading
      ) : (
        <BookingTable bookings={bookings} />
      )}

      {/* Pagination */}
      <Pagination page={page} pages={pages} setPage={setPage} />
    </div>
  );
};

export default BookingSection;
