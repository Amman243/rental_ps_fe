import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";

const initialMemberships = [
  { id_membership: 1, nama_tier: "Bronze", diskon_persen: 5, poin_bonus: 50 },
  { id_membership: 2, nama_tier: "Silver", diskon_persen: 10, poin_bonus: 75 },
  { id_membership: 3, nama_tier: "Gold", diskon_persen: 15, poin_bonus: 120 },
];

export default function Membership() {
  const [memberships, setMemberships] = useState(initialMemberships);
  const [query, setQuery] = useState("");
  const [modalState, setModalState] = useState({ open: false, mode: "create" });
  const [formData, setFormData] = useState({
    id_membership: null,
    nama_tier: "",
    diskon_persen: "",
    poin_bonus: "",
  });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, target: null });

  const filtered = useMemo(() => {
    return memberships.filter((item) => item.nama_tier.toLowerCase().includes(query.toLowerCase()));
  }, [memberships, query]);

  const closeModal = () => {
    setModalState({ open: false, mode: "create" });
    setFormData({ id_membership: null, nama_tier: "", diskon_persen: "", poin_bonus: "" });
  };

  const openCreateModal = () => {
    setModalState({ open: true, mode: "create" });
    setFormData({ id_membership: null, nama_tier: "", diskon_persen: "", poin_bonus: "" });
  };

  const openEditModal = (membership) => {
    setModalState({ open: true, mode: "edit" });
    setFormData({
      ...membership,
      diskon_persen: membership.diskon_persen?.toString() ?? "",
      poin_bonus: membership.poin_bonus?.toString() ?? "",
    });
  };

  const handleCreateMembership = (payload) => {
    console.log("TODO: POST /membership payload", payload);
  };

  const handleUpdateMembership = (id, payload) => {
    console.log("TODO: PUT /membership/" + id, payload);
  };

  const handleDeleteMembership = (id) => {
    console.log("TODO: DELETE /membership/" + id);
  };

  const handleSubmit = () => {
    if (!formData.nama_tier) return;

    if (modalState.mode === "create") {
      const newTier = {
        id_membership: Date.now(),
        nama_tier: formData.nama_tier,
        diskon_persen: formData.diskon_persen === "" ? null : Number(formData.diskon_persen),
        poin_bonus: formData.poin_bonus === "" ? null : Number(formData.poin_bonus),
      };
      handleCreateMembership(newTier);
      setMemberships((prev) => [...prev, newTier]);
    } else if (modalState.mode === "edit") {
      const updatedTier = {
        ...formData,
        diskon_persen: formData.diskon_persen === "" ? null : Number(formData.diskon_persen),
        poin_bonus: formData.poin_bonus === "" ? null : Number(formData.poin_bonus),
      };
      handleUpdateMembership(updatedTier.id_membership, updatedTier);
      setMemberships((prev) =>
        prev.map((item) => (item.id_membership === updatedTier.id_membership ? updatedTier : item)),
      );
    }
    closeModal();
  };

  const removeTier = (id) => {
    handleDeleteMembership(id);
    setMemberships((prev) => prev.filter((item) => item.id_membership !== id));
  };

  const askDeleteTier = (membership) => {
    setConfirmDelete({ open: true, target: membership });
  };

  const confirmRemoveTier = () => {
    if (!confirmDelete.target) return;
    removeTier(confirmDelete.target.id_membership);
    setConfirmDelete({ open: false, target: null });
  };

  const closeConfirmModal = () => setConfirmDelete({ open: false, target: null });

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Tier Membership</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari tier..."
              className="w-48 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <Plus className="h-4 w-4" /> Tambah Tier
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm dark:border-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide">
                No
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide">
                Nama Tier
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide">
                Diskon (%)
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide">
                Poin Bonus
              </th>
              <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
            {filtered.map((item, index) => (
              <tr key={item.id_membership}>
                <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                <td className="px-4 py-3 text-sm font-medium">{item.nama_tier}</td>
                <td className="px-4 py-3 text-sm">{item.diskon_persen ?? "-"}</td>
                <td className="px-4 py-3 text-sm">{item.poin_bonus ?? "-"}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => askDeleteTier(item)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500 dark:text-gray-400">
                  Tidak ada tier
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalState.open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {modalState.mode === "create" ? "Tambah Tier" : "Edit Tier"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800"
                title="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form
              className="mt-4 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <label className="block">
                <span className="text-sm">Nama Tier</span>
                <input
                  value={formData.nama_tier}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nama_tier: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  placeholder="Gold, Silver, dst"
                />
              </label>
              <label className="block">
                <span className="text-sm">Diskon (%)</span>
                <input
                  type="number"
                  value={formData.diskon_persen}
                  onChange={(e) => setFormData((prev) => ({ ...prev, diskon_persen: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  placeholder="0"
                />
              </label>
              <label className="block">
                <span className="text-sm">Poin Bonus</span>
                <input
                  type="number"
                  value={formData.poin_bonus}
                  onChange={(e) => setFormData((prev) => ({ ...prev, poin_bonus: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                  placeholder="0"
                />
              </label>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete.open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-red-600">Hapus Tier</h2>
              <button
                type="button"
                onClick={closeConfirmModal}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800"
                title="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
              Apakah Anda yakin ingin menghapus tier{" "}
              <span className="font-semibold">{confirmDelete.target?.nama_tier}</span>? Tindakan ini
              tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeConfirmModal}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmRemoveTier}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
