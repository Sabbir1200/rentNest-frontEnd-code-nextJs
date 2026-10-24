
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createProperty,
  updateProperty,
  deleteProperty,
  getCategories,
  getLandlordProperties,
} from "@/app/(dashboardGroup)/_actions/landlord.action";

type Category = {
  id: string;
  name: string;
};

type Property = {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  rentAmount: string | number;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
};

type PropertyForm = {
  categoryId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  rentAmount: string;
  isAvailable: boolean;
};

const initialForm: PropertyForm = {
  categoryId: "",
  title: "",
  description: "",
  address: "",
  city: "",
  rentAmount: "",
  isAvailable: true,
};

/**
 * API response থেকে Property object বের করে।
 * API সরাসরি Property array দিতে পারে অথবা
 * Rental Request-এর ভিতরে property দিতে পারে।
 */
function normalizeProperties(data: unknown): Property[] {
  if (!Array.isArray(data)) return [];

  const mappedProperties: Property[] = data
    .map((item: unknown): Property | null => {
      if (!item || typeof item !== "object") return null;

      const record = item as Record<string, unknown>;

      const property =
        record.property &&
        typeof record.property === "object"
          ? (record.property as Record<string, unknown>)
          : record;

      if (
        typeof property.id !== "string" ||
        typeof property.title !== "string"
      ) {
        return null;
      }

      return {
        id: property.id,
        categoryId:
          typeof property.categoryId === "string"
            ? property.categoryId
            : "",
        title: property.title,
        description:
          typeof property.description === "string"
            ? property.description
            : "",
        address:
          typeof property.address === "string"
            ? property.address
            : "",
        city:
          typeof property.city === "string"
            ? property.city
            : "",
        rentAmount:
          typeof property.rentAmount === "string" ||
          typeof property.rentAmount === "number"
            ? property.rentAmount
            : 0,
        isAvailable: property.isAvailable !== false,
        createdAt:
          typeof property.createdAt === "string"
            ? property.createdAt
            : undefined,
        updatedAt:
          typeof property.updatedAt === "string"
            ? property.updatedAt
            : undefined,
        category:
          property.category &&
          typeof property.category === "object"
            ? (property.category as Category)
            : undefined,
      };
    })
    .filter(
      (property): property is Property => property !== null
    );

  // একই property একাধিক rental request-এ থাকলে duplicate সরাবে।
  return Array.from(
    new Map(
      mappedProperties.map((property) => [
        property.id,
        property,
      ])
    ).values()
  );
}

export default function LandlordPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] =
    useState<Property | null>(null);
  const [form, setForm] = useState<PropertyForm>(initialForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [propertyResult, categoryResult] = await Promise.all([
        getLandlordProperties(),
        getCategories(),
      ]);

      if (!propertyResult.success) {
        throw new Error(
          propertyResult.message || "Failed to load properties."
        );
      }

      if (!categoryResult.success) {
        throw new Error(
          categoryResult.message || "Failed to load categories."
        );
      }

      setProperties(normalizeProperties(propertyResult.data));

      setCategories(
        Array.isArray(categoryResult.data)
          ? (categoryResult.data as Category[])
          : []
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  async function initializeData() {
    await loadData();
  }

  void initializeData();
}, [loadData]);

  const openCreateModal = () => {
    setEditingProperty(null);
    setForm(initialForm);
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const openEditModal = (property: Property) => {
    setEditingProperty(property);

    setForm({
      categoryId: property.categoryId,
      title: property.title,
      description: property.description,
      address: property.address,
      city: property.city,
      rentAmount: String(property.rentAmount),
      isAvailable: property.isAvailable,
    });

    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingProperty(null);
    setForm(initialForm);
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        categoryId: form.categoryId,
        title: form.title.trim(),
        description: form.description.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        rentAmount: Number(form.rentAmount),
        isAvailable: form.isAvailable,
      };

      if (
        !payload.categoryId ||
        !payload.title ||
        !payload.description ||
        !payload.address ||
        !payload.city ||
        !form.rentAmount ||
        !Number.isFinite(payload.rentAmount) ||
        payload.rentAmount <= 0
      ) {
        throw new Error("Please fill in all fields correctly.");
      }

      const result = editingProperty
        ? await updateProperty(editingProperty.id, payload)
        : await createProperty(payload);

      if (!result.success) {
        throw new Error(
          result.message ||
            `Failed to ${editingProperty ? "update" : "create"} property.`
        );
      }

      setSuccess(
        editingProperty
          ? "Property updated successfully."
          : "Property created successfully."
      );

      setIsModalOpen(false);
      setEditingProperty(null);
      setForm(initialForm);

      await loadData();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");
    setSuccess("");

    try {
      const result = await deleteProperty(id);

      if (!result.success) {
        throw new Error(
          result.message || "Failed to delete property."
        );
      }

      setSuccess("Property deleted successfully.");

      await loadData();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete property."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <section className="mb-7 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Properties Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your rental properties easily.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            + Add Property
          </button>
        </section>

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="font-bold"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div
            role="status"
            className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >
            <span>{success}</span>

            <button
              type="button"
              onClick={() => setSuccess("")}
              className="font-bold"
              aria-label="Dismiss success message"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading and property cards */}
        {loading ? (
          <div className="flex min-h-60 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
            <p className="text-sm text-slate-500">
              Loading your properties...
            </p>
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <div className="mb-4 text-5xl">🏠</div>

            <h2 className="text-xl font-semibold text-slate-800">
              No properties found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Add your first rental property to get started.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              + Add Your First Property
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <article
                key={property.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                    🏠
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      property.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {property.isAvailable
                      ? "Available"
                      : "Unavailable"}
                  </span>
                </div>

                <h2 className="line-clamp-2 text-lg font-bold text-slate-900">
                  {property.title || "Untitled Property"}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  📍 {property.address || "Address unavailable"}
                  {property.city ? `, ${property.city}` : ""}
                </p>

                <p className="mt-3 line-clamp-3 min-h-15 text-sm leading-6 text-slate-600">
                  {property.description || "No description provided."}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-xs text-slate-500">
                      Monthly rent
                    </p>

                    <p className="mt-1 text-xl font-bold text-green-600">
                      ৳
                      {Number(property.rentAmount || 0).toLocaleString(
                        "en-BD"
                      )}
                      <span className="text-sm font-medium text-slate-500">
                        /mo
                      </span>
                    </p>
                  </div>

                  <span className="max-w-28 truncate rounded-lg bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
                    {property.category?.name ||
                      categories.find(
                        (category) => category.id === property.categoryId
                      )?.name ||
                      "Property"}
                  </span>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() => openEditModal(property)}
                    disabled={deletingId === property.id || saving}
                    className="flex-1 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Update
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(property.id)}
                    disabled={deletingId === property.id || saving}
                    className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId === property.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* Create / Update modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeModal();
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="property-modal-title"
              className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
                <div>
                  <h2
                    id="property-modal-title"
                    className="text-xl font-bold text-slate-900"
                  >
                    {editingProperty
                      ? "Update Property"
                      : "Add New Property"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter the property details below.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg p-2 text-xl text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-5 sm:p-7"
              >
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Property title
                  </label>

                  <input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Family Apartment"
                    required
                    maxLength={150}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="categoryId"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Category
                  </label>

                  <select
                    id="categoryId"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Select a category</option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {categories.length === 0 && (
                    <p className="mt-2 text-xs text-amber-600">
                      No categories loaded. Check the categories API.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your property..."
                    required
                    rows={4}
                    className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="address"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Address
                    </label>

                    <input
                      id="address"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="e.g. Gollamari"
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      City
                    </label>

                    <input
                      id="city"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="e.g. Khulna"
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="rentAmount"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Monthly rent (৳)
                  </label>

                  <input
                    id="rentAmount"
                    name="rentAmount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={form.rentAmount}
                    onChange={handleChange}
                    placeholder="e.g. 12000"
                    required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {editingProperty && (
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-slate-50 p-4">
                    <input
                      type="checkbox"
                      checked={form.isAvailable}
                      onChange={(event) =>
                        setForm((previous) => ({
                          ...previous,
                          isAvailable: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />

                    <span className="text-sm font-medium text-slate-700">
                      Property is available for rent
                    </span>
                  </label>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? "Saving..."
                      : editingProperty
                        ? "Save Changes"
                        : "Create Property"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
