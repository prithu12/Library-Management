import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";

const MyBooks = () => {
  const { studentsBooks, fetchStudentBooks } = useContext(AppContext);

  const handleReturn = async (borrowId) => {
    try {
      const { data } = await axiosInstance.post("/borrow/return", {
        borrowId,
      });

      if (data.success) {
        toast.success("Book returned successfully");
        fetchStudentBooks();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to return book"
      );
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">My Books</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage your borrowed and returned books
        </p>
      </div>

      {studentsBooks.length === 0 ? (
        <div className="rounded-xl bg-gray-50 py-10 text-center text-sm text-gray-500">
          No books found.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="px-4">Book</th>
                <th className="px-4">Borrowed</th>
                <th className="px-4">Due Date</th>
                <th className="px-4">Returned</th>
                <th className="px-4">Status</th>
                <th className="px-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {studentsBooks.map((item) => (
                <tr
                  key={item._id}
                  className="rounded-xl bg-gray-50 text-sm text-gray-700"
                >
                  {/* Book */}
                  <td className="rounded-l-xl px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.book?.coverImage?.url}
                        alt={item.book?.title}
                        className="h-12 w-10 rounded-md object-cover"
                      />
                      <div className="font-medium">
                        {item.book?.title}
                      </div>
                    </div>
                  </td>

                  {/* Borrowed */}
                  <td className="px-4 py-4">
                    {new Date(item.borrowedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  {/* Due */}
                  <td className="px-4 py-4">
                    {new Date(item.dueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  {/* Returned */}
                  <td className="px-4 py-4">
                    {item.returnedAt
                      ? new Date(item.returnedAt).toLocaleDateString("en-US")
                      : "Not Returned"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        item.status === "returned"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Return Button */}
                  <td className="rounded-r-xl px-4 py-4">
                    {item.status === "borrowed" && (
                      <button
                        onClick={() => handleReturn(item._id)}
                        className="px-4 py-2 text-xs font-medium rounded-lg bg-black text-white hover:opacity-90"
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBooks;