import React, { useState, useMemo } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import './Users.css';

// Simple modal component used for create/update
function Modal({ visible, title, children, onClose }) {
	if (!visible) return null;
	return (
		<div className="modal-backdrop">
			<div className="modal-window">
				<div className="modal-header">
					<h3>{title}</h3>
					<button className="btn-close" onClick={onClose}>×</button>
				</div>
				<div className="modal-body">{children}</div>
			</div>
		</div>
	);
}

export default function Users() {
	// sample initial data
	const [users, setUsers] = useState([
		{ id: 1, name: 'Admin Owner', role: 'owner' },
		{ id: 2, name: 'Budi Staff', role: 'staff' },
	]);

	const [showModal, setShowModal] = useState(false);
	const [editing, setEditing] = useState(null); // null => create, object => edit
	const [form, setForm] = useState({ name: '', role: 'staff' });
	const [showDelete, setShowDelete] = useState(false);
	const [toDelete, setToDelete] = useState(null);

	function openCreate() {
		setEditing(null);
		setForm({ name: '', role: 'staff' });
		setShowModal(true);
	}
	function openEdit(user) {
		setEditing(user);
		setForm({ name: user.name, role: user.role });
		setShowModal(true);
	}
	function handleSave(e) {
		e.preventDefault();
		if (!form.name.trim()) return;
		if (editing) {
			setUsers(prev => prev.map(u => (u.id === editing.id ? { ...u, name: form.name.trim(), role: form.role } : u)));
		} else {
			const nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
			setUsers(prev => [...prev, { id: nextId, name: form.name.trim(), role: form.role }]);
		}
		setShowModal(false);
	}
	function confirmDelete(user) {
		setToDelete(user);
		setShowDelete(true);
	}
	function doDelete() {
		if (!toDelete) return;
		setUsers(prev => prev.filter(u => u.id !== toDelete.id));
		setToDelete(null);
		setShowDelete(false);
	}

	// filter users by query
	const [query, setQuery] = useState('');

	const filtered = useMemo(() => {
		return users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()));
	}, [users, query]);

	return (
		<section className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h1 className="text-2xl font-bold tracking-tight">Daftar User</h1>
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-900">
						<Search className="h-5 w-5 text-gray-400" />
						<input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Cari user…"
							className="w-56 bg-transparent text-sm outline-none placeholder:text-gray-400"
						/>
					</div>

					<button
						onClick={openCreate}
						className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
					>
						<Plus className="h-4 w-4" /> Tambah User
					</button>
				</div>
			</div>

			<div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm dark:border-gray-800">
				<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
					<thead className="bg-gray-50 dark:bg-gray-900">
						<tr>
							<th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide">No</th>
							<th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide">Nama</th>
							<th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wide">Jabatan</th>
							<th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wide">Aksi</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
{filtered.map((u, idx) => (
						<tr key={u.id}>
							<td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
							<td className="px-4 py-3 text-sm font-medium">{u.name}</td>
							<td className="px-4 py-3 text-sm">{u.role === 'owner' ? 'Owner' : 'Staff Pegawai'}</td>
							<td className="px-4 py-3 text-center space-x-2">
								<button title="Edit (opsional)" className="mr-2 rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800" onClick={() => openEdit(u)}>
									<Pencil className="h-4 w-4" />
								</button>
								<button onClick={() => confirmDelete(u)} className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
									<Trash2 className="h-4 w-4" />
								</button>
							</td>
						</tr>
					))}

					{filtered.length === 0 && (
						<tr>
							<td colSpan="4" className="py-4 text-center text-gray-500 dark:text-gray-400">Belum ada user.</td>
						</tr>
					)}
					</tbody>
				</table>
			</div>

			{/* Create / Edit Modal */}
			<Modal visible={showModal} title={editing ? 'Edit User' : 'Tambah User'} onClose={() => setShowModal(false)}>
				<form onSubmit={handleSave} className="form">
					<label>Nama</label>
					<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
					<label>Jabatan</label>
					<select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
						<option value="owner">Owner</option>
						<option value="staff">Staff Pegawai</option>
					</select>
					<div className="modal-actions">
						<button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Batal</button>
						<button type="submit" className="btn-primary">Simpan</button>
					</div>
				</form>
			</Modal>

			{/* Delete Confirmation Modal */}
			<Modal visible={showDelete} title="Konfirmasi Hapus" onClose={() => setShowDelete(false)}>
				<p>Hapus user "{toDelete?.name}"?</p>
				<div className="modal-actions">
					<button className="btn-ghost" onClick={() => setShowDelete(false)}>Batal</button>
					<button className="btn-danger" onClick={doDelete}>Hapus</button>
				</div>
			</Modal>
		</section>
	);
}