import { motion } from "framer-motion";

export default function Pagination({ page, pages, setPage }) {

  if (pages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">

      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-3 py-2 bg-white border rounded-lg disabled:opacity-40"
      >
        Previous
      </button>

      {[...Array(pages)].map((_, i) => {
        const pageNumber = i + 1;

        return (
          <motion.button
            key={pageNumber}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage(pageNumber)}
            className={`px-3 py-2 rounded-lg text-sm ${
              page === pageNumber
                ? "bg-blue-600 text-white"
                : "bg-white border"
            }`}
          >
            {pageNumber}
          </motion.button>
        );
      })}

      <button
        disabled={page === pages}
        onClick={() => setPage(page + 1)}
        className="px-3 py-2 bg-white border rounded-lg disabled:opacity-40"
      >
        Next
      </button>

    </div>
  );
}