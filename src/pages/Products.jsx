import { useEffect, useState } from "react";
import api from "../api/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    stock_quantity: "",
    is_available: true,
    image_url: "",
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/partner/products");

      setProducts(
        response.data.products || response.data || []
      );
    } catch (error) {
      console.error("Failed to load products:", error);

      setError(
        error.response?.data?.error ||
          "Unable to load your products."
      );
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingProduct(null);

    setFormData({
      name: "",
      description: "",
      category: "",
      brand: "",
      price: "",
      stock_quantity: "",
      is_available: true,
      image_url: "",
    });

    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "",
      brand: product.brand || "",
      price: product.price ?? "",
      stock_quantity: product.stock_quantity ?? "",
      is_available: product.is_available ?? true,
      image_url: product.image_url || "",
    });

    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingProduct(null);
    setFormError("");
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setFormError("Product name is required.");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        brand: formData.brand.trim(),
        price:
          formData.price === ""
            ? null
            : Number(formData.price),
        stock_quantity:
          formData.stock_quantity === ""
            ? 0
            : Number(formData.stock_quantity),
        is_available: formData.is_available,
        image_url: formData.image_url.trim(),
      };

      if (editingProduct) {
        const response = await api.patch(
          `/partner/products/${editingProduct.id}`,
          payload
        );

        const updatedProduct =
          response.data.product || response.data;

        setProducts((previous) =>
          previous.map((product) =>
            product.id === editingProduct.id
              ? updatedProduct
              : product
          )
        );
      } else {
        const response = await api.post(
          "/partner/products",
          payload
        );

        const newProduct =
          response.data.product || response.data;

        setProducts((previous) => [
          newProduct,
          ...previous,
        ]);
      }

      closeForm();
    } catch (error) {
      console.error("Failed to save product:", error);

      setFormError(
        error.response?.data?.error ||
          "Unable to save the product."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (product) => {
    try {
      const response = await api.patch(
        `/partner/products/${product.id}`,
        {
          is_available: !product.is_available,
        }
      );

      const updatedProduct =
        response.data.product || response.data;

      setProducts((previous) =>
        previous.map((item) =>
          item.id === product.id
            ? updatedProduct
            : item
        )
      );
    } catch (error) {
      console.error(
        "Failed to update product availability:",
        error
      );

      alert(
        error.response?.data?.error ||
          "Unable to update product availability."
      );
    }
  };

  const deleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/partner/products/${product.id}`
      );

      setProducts((previous) =>
        previous.filter(
          (item) => item.id !== product.id
        )
      );
    } catch (error) {
      console.error("Failed to delete product:", error);

      alert(
        error.response?.data?.error ||
          "Unable to delete the product."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Products
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage the products your business offers on Optocare.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          + Add Product
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchProducts}
            className="mt-3 text-sm font-medium text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Loading products...
          </p>
        </div>
      ) : products.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <span className="text-xl text-slate-500">
              +
            </span>
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No products yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Add the products your business offers so customers can discover what you sell.
          </p>

          <button
            type="button"
            onClick={openAddForm}
            className="mt-5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        /* Products table */
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Price
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="transition hover:bg-slate-50"
                  >
                    {/* Product */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                            <span className="text-xs text-slate-400">
                              No image
                            </span>
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {product.name}
                          </p>

                          {product.brand && (
                            <p className="mt-1 text-xs text-slate-500">
                              {product.brand}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {product.category || "—"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">
                        {product.price !== null &&
                        product.price !== undefined &&
                        product.price !== ""
                          ? product.price
                          : "—"}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {product.stock_quantity ?? 0}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {product.is_available ? (
                        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          Unavailable
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(product)
                          }
                          className="text-sm font-medium text-slate-700 hover:text-slate-900"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleAvailability(product)
                          }
                          className="text-sm font-medium text-slate-600 hover:text-slate-900"
                        >
                          {product.is_available
                            ? "Hide"
                            : "Show"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteProduct(product)
                          }
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* Modal header */}
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {editingProduct
                      ? "Edit Product"
                      : "Add Product"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {editingProduct
                      ? "Update the details of this product."
                      : "Add a product to your Optocare listing."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  className="text-xl leading-none text-slate-400 hover:text-slate-700"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <p className="text-sm text-red-700">
                    {formError}
                  </p>
                </div>
              )}

              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Product Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ray-Ban RX5228"
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe this product..."
                  className="w-full resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Category + Brand */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="category"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Category
                  </label>

                  <input
                    id="category"
                    name="category"
                    type="text"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Eyeglasses"
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="brand"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Brand
                  </label>

                  <input
                    id="brand"
                    name="brand"
                    type="text"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g. Ray-Ban"
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="price"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Price
                  </label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 8500"
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

                <div>
                  <label
                    htmlFor="stock_quantity"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Stock Quantity
                  </label>

                  <input
                    id="stock_quantity"
                    name="stock_quantity"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    placeholder="e.g. 20"
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label
                  htmlFor="image_url"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Product Image URL
                </label>

                <input
                  id="image_url"
                  name="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  Image upload can be integrated later.
                </p>
              </div>

              {/* Availability */}
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  name="is_available"
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300"
                />

                <span className="text-sm text-slate-700">
                  Product is available to customers
                </span>
              </label>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                    ? "Save Changes"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;