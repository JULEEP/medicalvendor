import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { utils, writeFile } from "xlsx";
import axios from "axios";

export default function PosterList() {
  const [posters, setPosters] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postersPerPage = 5;

  useEffect(() => {
    axios
      .get("https://posterbnaobackend.onrender.com/api/poster/getallposter")
      .then((res) => {
        if (res.data) {
          setPosters(res.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching posters:", error);
      });
  }, []);

  const exportData = (type) => {
    const exportPosters = filteredPosters.map(
      ({ _id, name, categoryName, price, description, size, festivalDate, inStock }) => ({
        id: _id,
        name: name || "N/A",
        categoryName: categoryName || "N/A",
        price: price || "N/A",
        description: description || "N/A",
        size: size || "N/A",
        festivalDate: festivalDate || "N/A",
        inStock: inStock ? "In Stock" : "Out of Stock",
      })
    );
    const ws = utils.json_to_sheet(exportPosters);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Posters");
    writeFile(wb, `posters.${type}`);
  };

  const filteredPosters = posters.filter((poster) => {
    return poster.name.toLowerCase().includes(search.toLowerCase());
  });

  const indexOfLastPoster = currentPage * postersPerPage;
  const indexOfFirstPoster = indexOfLastPoster - postersPerPage;
  const currentPosters = filteredPosters.slice(indexOfFirstPoster, indexOfLastPoster);
  const totalPages = Math.ceil(filteredPosters.length / postersPerPage);

  const handleEdit = (id) => {
    console.log("Editing poster with ID:", id);
    // You can redirect to an edit page or open a modal to edit the poster's details
  };

  const handleDelete = (id) => {
    axios
      .delete(`https://posterbnaobackend.onrender.com/api/poster/delete/${id}`)
      .then((res) => {
        alert("Poster deleted successfully!");
        setPosters(posters.filter((poster) => poster._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting poster:", error);
      });
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-900">All Posters</h2>
      </div>

      <div className="flex justify-between mb-4">
        <input
          className="w-1/3 p-2 border rounded"
          placeholder="Search by poster name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => exportData("csv")}>
            CSV
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => exportData("xlsx")}>
            Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-purple-600 text-white">
              <th className="p-2 border">Sl</th>
              <th className="p-2 border">Images</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Size</th>
              <th className="p-2 border">Festival Date</th>
              <th className="p-2 border">In Stock</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPosters.map((poster, index) => (
              <tr key={poster._id} className="border-b">
                <td className="p-2 border">{index + 1 + indexOfFirstPoster}</td>
                <td className="p-2 border">
                  <div className="flex gap-2">
                    {poster.images.slice(0, 3).map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`poster-image-${idx}`}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => (e.target.src = "/default-image.jpg")}
                      />
                    ))}
                  </div>
                </td>
                <td className="p-2 border">{poster.name || "N/A"}</td>
                <td className="p-2 border">{poster.categoryName || "N/A"}</td>
                <td className="p-2 border">{poster.price || "N/A"}</td>
                <td className="p-2 border">{poster.description || "N/A"}</td>
                <td className="p-2 border">{poster.size || "N/A"}</td>
                <td className="p-2 border">{new Date(poster.festivalDate).toLocaleDateString()}</td>
                <td className="p-2 border">{poster.inStock ? "In Stock" : "Out of Stock"}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    className="bg-blue-500 text-white p-1 rounded"
                    onClick={() => handleEdit(poster._id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-500 text-white p-1 rounded"
                    onClick={() => handleDelete(poster._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 gap-4">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
