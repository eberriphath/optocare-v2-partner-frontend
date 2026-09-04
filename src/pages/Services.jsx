import { useEffect, useState } from "react";
import api from "../api/api";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    is_active: true,
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/partner/services");

      setServices(response.data.services || response.data || []);
    } catch (error) {
      console.error("Failed to load services:", error);

      setError(
        error.response?.data?.error ||
          "Unable to load your services."
      );
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingService(null);

    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      is_active: true,
    });

    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (service) => {
    setEditingService(service);

    setFormData({
      name: service.name || "",
      description: service.description || "",
      category: service.category || "",
      price: service.price ?? "",
      is_active: service.is_active ?? true,
    });

    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingService(null);
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
      setFormError("Service name is required.");
      return;
    }

    try {
      setSaving(true);
      setFormError("");

      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        price:
          formData.price === ""
            ? null
            : Number(formData.price),
        is_active: formData.is_active,
      };

      if (editingService) {
        const response = await api.patch(
          `/partner/services/${editingService.id}`,
          payload
        );

        const updatedService =
          response.data.service || response.data;

        setServices((previous) =>
          previous.map((service) =>
            service.id === editingService.id
              ? updatedService
              : service
          )
        );
      } else {
        const response = await api.post(
          "/partner/services",
          payload
        );

        const newService =
          response.data.service || response.data;

        setServices((previous) => [
          newService,
          ...previous,
        ]);
      }

      closeForm();
    } catch (error) {
      console.error("Failed to save service:", error);

      setFormError(
        error.response?.data?.error ||
          "Unable to save the service."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleServiceStatus = async (service) => {
    try {
      const response = await api.patch(
        `/partner/services/${service.id}`,
        {
          is_active: !service.is_active,
        }
      );

      const updatedService =
        response.data.service || response.data;

      setServices((previous) =>
        previous.map((item) =>
          item.id === service.id
            ? updatedService
            : item
        )
      );
    } catch (error) {
      console.error(
        "Failed to update service status:",
        error
      );

      alert(
        error.response?.data?.error ||
          "Unable to update service status."
      );
    }
  };

  const deleteService = async (service) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.name}"?`
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/partner/services/${service.id}`
      );

      setServices((previous) =>
        previous.filter(
          (item) => item.id !== service.id
        )
      );
    } catch (error) {
      console.error("Failed to delete service:", error);

      alert(
        error.response?.data?.error ||
          "Unable to delete the service."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Services
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage the services your business offers on Optocare.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          + Add Service
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
            onClick={fetchServices}
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
            Loading services...
          </p>
        </div>
      ) : services.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
            <span className="text-xl text-slate-500">
              +
            </span>
          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No services yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Add the services your business provides so customers can discover what you offer.
          </p>

          <button
            type="button"
            onClick={openAddForm}
            className="mt-5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Add Your First Service
          </button>
        </div>
      ) : (
        /* Services table */
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Service
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Price
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
                {services.map((service) => (
                  <tr
                    key={service.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {service.name}
                        </p>

                        {service.description && (
                          <p className="mt-1 max-w-md truncate text-xs text-slate-500">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {service.category || "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-900">
                        {service.price !== null &&
                        service.price !== undefined &&
                        service.price !== ""
                          ? service.price
                          : "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {service.is_active ? (
                        <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(service)
                          }
                          className="text-sm font-medium text-slate-700 hover:text-slate-900"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleServiceStatus(service)
                          }
                          className="text-sm font-medium text-slate-600 hover:text-slate-900"
                        >
                          {service.is_active
                            ? "Deactivate"
                            : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteService(service)
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
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {editingService
                      ? "Edit Service"
                      : "Add Service"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {editingService
                      ? "Update the details of this service."
                      : "Add a service to your Optocare listing."}
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
                  Service Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Eye Examination"
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
                  placeholder="Describe this service..."
                  className="w-full resize-none rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* Category + Price */}
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
                    placeholder="e.g. Eye Care"
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>

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
                    placeholder="e.g. 1500"
                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>

              {/* Active */}
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  name="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300"
                />

                <span className="text-sm text-slate-700">
                  Service is active and visible to customers
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
                    : editingService
                    ? "Save Changes"
                    : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;