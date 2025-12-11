import React from "react";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa"; // Importing the required icons

const ProductList = () => {
  // Dummy product data for different vegetarian food items
  const products = [
    {
      id: 2,
      name: "Veg Pizza",
      description: "A classic vegetarian pizza with fresh vegetables and cheese.",
      price: 450,
      offerPrice: 400,
      image: "https://i.pinimg.com/originals/db/89/b4/db89b4276ee53c3571c939e7970fb0fd.png", // Veg Pizza image
      category: "Pizza",
      subcategory: "Vegetarian",
      restaurantName: "Pizza Palace",
      address: "456 Pizza Avenue, Food City",
    },
    {
      id: 3,
      name: "Spaghetti Aglio Olio",
      description: "Italian pasta with garlic, olive oil, and chili flakes.",
      price: 350,
      offerPrice: 300,
      image: "https://i.pinimg.com/originals/db/89/b4/db89b4276ee53c3571c939e7970fb0fd.png", // Veg Pizza image
      category: "Pasta",
      subcategory: "Italian",
      restaurantName: "Pasta World",
      address: "789 Pasta Street, Food City",
    },
    {
      id: 5,
      name: "Chocolate Cake",
      description: "Rich and creamy chocolate cake with a smooth frosting.",
      price: 200,
      offerPrice: 180,
      image: "https://i.pinimg.com/originals/db/89/b4/db89b4276ee53c3571c939e7970fb0fd.png", // Veg Pizza image
      category: "Dessert",
      subcategory: "Cake",
      restaurantName: "Dessert Delight",
      address: "101 Dessert Road, Food City",
    },
    {
      id: 6,
      name: "Veg Biryani",
      description: "Aromatic rice with mixed vegetables and fragrant spices.",
      price: 350,
      offerPrice: 300,
      image: "https://i.pinimg.com/originals/db/89/b4/db89b4276ee53c3571c939e7970fb0fd.png", // Veg Pizza image
      category: "Biryani",
      subcategory: "Vegetarian",
      restaurantName: "Biryani Delights",
      address: "102 Biryani Lane, Food City",
    },
  ];

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-4">Product List - Vegetarian Food Items</h3>
      <table className="min-w-full border-collapse">
        <thead className="bg-green-100">
          <tr className="border-b">
            <th className="p-4 text-left">Image</th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Description</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Offer Price</th>
            <th className="p-4 text-left">Restaurant</th>
            <th className="p-4 text-left">Address</th>
            <th className="p-4 text-left">Category</th>
            <th className="p-4 text-left">Subcategory</th>
            <th className="p-4 text-left">Actions</th> {/* Added Actions Column */}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b">
              {/* Image */}
              <td className="p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded"
                />
              </td>
              {/* Name */}
              <td className="p-4">{product.name}</td>
              {/* Description */}
              <td className="p-4">{product.description}</td>
              {/* Price */}
              <td className="p-4">₹{product.price}</td>
              {/* Offer Price */}
              <td className="p-4">
                ₹{product.offerPrice}{" "}
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.price}
                </span>
              </td>
              {/* Restaurant */}
              <td className="p-4">{product.restaurantName}</td>
              {/* Address */}
              <td className="p-4">{product.address}</td>
              {/* Category */}
              <td className="p-4">{product.category}</td>
              {/* Subcategory */}
              <td className="p-4">{product.subcategory}</td>
              {/* Actions */}
              <td className="p-4 flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <FaEye /> {/* View icon */}
                </button>
                <button className="text-yellow-500 hover:text-yellow-700">
                  <FaEdit /> {/* Edit icon */}
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <FaTrashAlt /> {/* Delete icon */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
