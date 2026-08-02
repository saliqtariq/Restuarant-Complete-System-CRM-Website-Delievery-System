"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MenuCategory,
  MenuItem,
  createMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleItemAvailability,
} from "@/app/actions/menu";
import { Plus, Trash2, Pencil, Power, ChevronDown, ChevronRight } from "lucide-react";

// ─── Image URL normalizer ────────────────────────────────────────────────────
// Accepts paths like "public/beef.png", "beef.png", "/beef.png",
// or full https:// URLs — always returns a valid src for next/image.
function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  // Already an absolute URL or a root-relative path — use as-is
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    return trimmed;
  }
  // Strip leading "public/" if the user typed the folder name
  const withoutPublic = trimmed.startsWith("public/") ? trimmed.slice("public".length) : "/" + trimmed;
  return withoutPublic;
}

// ─── Category Form ────────────────────────────────────────────────────────────

function CategoryForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Partial<MenuCategory>;
  onSave: (data: Omit<MenuCategory, "id" | "created_at">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [image_url, setImageUrl] = useState(initial?.image_url ?? "");
  const [sort_order, setSortOrder] = useState(initial?.sort_order ?? 0);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Category Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Burgers"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E63946]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Image Path / URL</label>
          <input
            type="text"
            placeholder="/categoryimage.png"
            value={image_url}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E63946]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Sort Order</label>
          <input
            type="number"
            min="0"
            value={sort_order}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E63946]"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </button>
        <button
          onClick={() => onSave({ name, image_url: image_url || null, sort_order })}
          className="bg-[#E63946] text-white text-sm font-bold py-1.5 px-5 rounded-lg hover:bg-red-600 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// ─── Item Form ────────────────────────────────────────────────────────────────

function ItemForm({
  categories,
  initial,
  onSave,
  onCancel,
}: {
  categories: MenuCategory[];
  initial?: Partial<MenuItem>;
  onSave: (data: Omit<MenuItem, "id" | "created_at">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [image_url, setImageUrl] = useState(initial?.image_url ?? "");
  const [category_id, setCategoryId] = useState(initial?.category_id ?? categories[0]?.id ?? "");

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Item Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Outlaw Zinger"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E63946]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Category</label>
          <select
            value={category_id}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E63946]"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Price (Rs)</label>
          <input
            type="number"
            required
            min="0"
            placeholder="e.g. 650"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E63946]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Image Path / URL</label>
          <input
            type="text"
            placeholder="/itemimage.png"
            value={image_url}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E63946]"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
          <input
            type="text"
            placeholder="Short description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E63946]"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700">
          Cancel
        </button>
        <button
          onClick={() =>
            onSave({
              name,
              category_id,
              description: description || null,
              price: Number(price),
              image_url: image_url || null,
              is_available: true,
            })
          }
          className="bg-[#E63946] text-white text-sm font-bold py-1.5 px-5 rounded-lg hover:bg-red-600 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Props = {
  initialCategories: MenuCategory[];
  initialItems: MenuItem[];
};

export function MenuManager({ initialCategories, initialItems }: Props) {
  const [categories, setCategories] = useState(initialCategories);
  const [items, setItems] = useState(initialItems);
  const [addingCategory, setAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [addingItemForCategory, setAddingItemForCategory] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"categories" | "items">("categories");

  const toggleExpand = (id: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Category handlers ──
  const handleCreateCategory = async (data: Omit<MenuCategory, "id" | "created_at">) => {
    const res = await createMenuCategory(data);
    if (res.success) {
      window.location.reload();
    } else {
      alert("Error: " + res.error);
    }
  };

  const handleUpdateCategory = async (id: string, data: Omit<MenuCategory, "id" | "created_at">) => {
    const res = await updateMenuCategory(id, data);
    if (res.success) {
      setCategories(categories.map((c) => (c.id === id ? { ...c, ...data } : c)));
      setEditingCategoryId(null);
    } else {
      alert("Error: " + res.error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category and ALL its items?")) return;
    const res = await deleteMenuCategory(id);
    if (res.success) {
      setCategories(categories.filter((c) => c.id !== id));
      setItems(items.filter((item) => item.category_id !== id));
    } else {
      alert("Error: " + res.error);
    }
  };

  // ── Item handlers ──
  const handleCreateItem = async (data: Omit<MenuItem, "id" | "created_at">) => {
    const res = await createMenuItem(data);
    if (res.success) {
      window.location.reload();
    } else {
      alert("Error: " + res.error);
    }
  };

  const handleUpdateItem = async (id: string, data: Omit<MenuItem, "id" | "created_at">) => {
    const res = await updateMenuItem(id, data);
    if (res.success) {
      setItems(items.map((item) => (item.id === id ? { ...item, ...data } : item)));
      setEditingItemId(null);
    } else {
      alert("Error: " + res.error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const res = await deleteMenuItem(id);
    if (res.success) {
      setItems(items.filter((item) => item.id !== id));
    } else {
      alert("Error: " + res.error);
    }
  };

  const handleToggleAvailability = async (id: string, current: boolean) => {
    const res = await toggleItemAvailability(id, !current);
    if (res.success) {
      setItems(items.map((item) => (item.id === id ? { ...item, is_available: !current } : item)));
    }
  };

  const getCategoryItems = (categoryId: string) =>
    items.filter((item) => item.category_id === categoryId);

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
            activeTab === "categories"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab("items")}
          className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
            activeTab === "items"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          All Items ({items.length})
        </button>
      </div>

      {/* ─── CATEGORIES VIEW ─── */}
      {activeTab === "categories" && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <button
              onClick={() => setAddingCategory(true)}
              className="bg-[#E63946] hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm"
            >
              <Plus size={16} /> Add Category
            </button>
          </div>

          {addingCategory && (
            <CategoryForm
              onSave={handleCreateCategory}
              onCancel={() => setAddingCategory(false)}
            />
          )}

          <div className="flex flex-col gap-3">
            {categories.length === 0 ? (
              <p className="text-gray-400 text-sm">No categories yet.</p>
            ) : (
              categories.map((cat) => {
                const catItems = getCategoryItems(cat.id);
                const isExpanded = expandedCategories.has(cat.id);
                return (
                  <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Category Header */}
                    {editingCategoryId === cat.id ? (
                      <div className="p-4">
                        <CategoryForm
                          initial={cat}
                          onSave={(data) => handleUpdateCategory(cat.id, data)}
                          onCancel={() => setEditingCategoryId(null)}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between px-5 py-4">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => toggleExpand(cat.id)}
                            className="text-gray-400 hover:text-gray-700"
                          >
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                          {normalizeImageUrl(cat.image_url) && (
                            <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                              <Image
                                src={normalizeImageUrl(cat.image_url)!}
                                alt={cat.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{cat.name}</p>
                            <p className="text-xs text-gray-400">{catItems.length} items</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setAddingItemForCategory(cat.id);
                              if (!isExpanded) toggleExpand(cat.id);
                            }}
                            className="flex items-center gap-1 text-xs font-bold text-[#E63946] hover:underline px-2 py-1"
                          >
                            <Plus size={12} /> Add Item
                          </button>
                          <button
                            onClick={() => setEditingCategoryId(cat.id)}
                            className="p-1.5 bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Expanded Items */}
                    {isExpanded && (
                      <div className="border-t border-gray-100">
                        {addingItemForCategory === cat.id && (
                          <div className="p-4 bg-gray-50">
                            <ItemForm
                              categories={categories}
                              initial={{ category_id: cat.id }}
                              onSave={handleCreateItem}
                              onCancel={() => setAddingItemForCategory(null)}
                            />
                          </div>
                        )}
                        {catItems.length === 0 ? (
                          <p className="px-5 py-4 text-sm text-gray-400">No items in this category.</p>
                        ) : (
                          <div className="divide-y divide-gray-50">
                            {catItems.map((item) =>
                              editingItemId === item.id ? (
                                <div key={item.id} className="p-4 bg-gray-50">
                                  <ItemForm
                                    categories={categories}
                                    initial={item}
                                    onSave={(data) => handleUpdateItem(item.id, data)}
                                    onCancel={() => setEditingItemId(null)}
                                  />
                                </div>
                              ) : (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/50"
                                >
                                  <div className="flex items-center gap-3">
                                    {normalizeImageUrl(item.image_url) && (
                                      <div className="w-9 h-9 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                        <Image
                                          src={normalizeImageUrl(item.image_url)!}
                                          alt={item.name}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    )}
                                    <div>
                                      <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                                      {item.description && (
                                        <p className="text-xs text-gray-400 truncate max-w-xs">{item.description}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-900 text-sm">
                                      Rs {item.price.toLocaleString()}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                      item.is_available
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-600"
                                    }`}>
                                      {item.is_available ? "Available" : "Unavailable"}
                                    </span>
                                    <button
                                      onClick={() => handleToggleAvailability(item.id, item.is_available)}
                                      className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600"
                                      title="Toggle availability"
                                    >
                                      <Power size={13} />
                                    </button>
                                    <button
                                      onClick={() => setEditingItemId(item.id)}
                                      className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                                    >
                                      <Pencil size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteItem(item.id)}
                                      className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ─── ALL ITEMS VIEW ─── */}
      {activeTab === "items" && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <button
              onClick={() => setAddingItemForCategory("any")}
              className="bg-[#E63946] hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors text-sm"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>

          {addingItemForCategory === "any" && (
            <ItemForm
              categories={categories}
              onSave={handleCreateItem}
              onCancel={() => setAddingItemForCategory(null)}
            />
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/70 border-b border-gray-100 text-xs uppercase text-gray-400 font-bold">
                <tr>
                  <th className="px-5 py-3 text-left">Item</th>
                  <th className="px-5 py-3 text-left">Category</th>
                  <th className="px-5 py-3 text-right">Price</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                      No items yet.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const cat = categories.find((c) => c.id === item.category_id);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            {normalizeImageUrl(item.image_url) && (
                              <div className="w-9 h-9 relative rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                <Image src={normalizeImageUrl(item.image_url)!} alt={item.name} fill className="object-cover" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-gray-900">{item.name}</p>
                              {item.description && (
                                <p className="text-xs text-gray-400 truncate max-w-xs">{item.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-600 text-xs">{cat?.name ?? "—"}</td>
                        <td className="px-5 py-3 text-right font-bold text-gray-900">
                          Rs {item.price.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            item.is_available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                          }`}>
                            {item.is_available ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleToggleAvailability(item.id, item.is_available)}
                              className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-yellow-50 hover:text-yellow-600"
                            >
                              <Power size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 rounded-lg bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
