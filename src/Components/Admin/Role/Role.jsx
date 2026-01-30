import React, { useEffect, useState } from "react";
import "./Role.css";

const emptyForm = { fullName: "", shortName: "", code: 0 };

export const Role = () => {
  const [roles, setRoles] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const token = localStorage.getItem("accessToken");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  /* ================= GET ALL ================= */
  const fetchRoles = async () => {
    try {
      const res = await fetch("https://localhost:7265/api/admin/Role/GetAll", { headers });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRoles(data);
    } catch {
      setError("❌ Data olishda xatolik yuz berdi");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= ADD ================= */
  const handleAdd = async () => {
    setError("");
    if (!form.fullName || !form.shortName) {
      setError("❗ Barcha maydonlarni to‘ldiring");
      return;
    }

    try {
      const res = await fetch("https://localhost:7265/api/admin/Role/Create", {
        method: "POST",
        headers,
        body: JSON.stringify({
          fullName: form.fullName,
          shortName: form.shortName,
          code: Number(form.code),
        }),
      });
      if (!res.ok) throw new Error();
      await fetchRoles();
      setAddMode(false);
      setForm(emptyForm);
    } catch {
      setError("❌ Add qilishda xatolik yuz berdi");
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async (id) => {
    setError("");
    if (!form.fullName || !form.shortName) {
      setError("❗ Barcha maydonlarni to‘ldiring");
      return;
    }

    try {
      const res = await fetch(`https://localhost:7265/api/admin/Role/Update?id=${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          fullName: form.fullName,
          shortName: form.shortName,
          code: Number(form.code),
        }),
      });
      if (!res.ok) throw new Error();
      await fetchRoles();
      setEditId(null);
      setForm(emptyForm);
    } catch {
      setError("❌ Update qilishda xatolik yuz berdi");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Rostdan ham o‘chirmoqchimisiz?")) return;

    try {
      const res = await fetch(`https://localhost:7265/api/admin/Role/Delete?id=${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error();
      await fetchRoles();
    } catch {
      setError("❌ Delete qilishda xatolik yuz berdi");
    }
  };

  return (
    <div className="role-wrapper">
      <h2>Roles</h2>

      {error && <div className="role-error">{error}</div>}

      <table className="role-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Short Name</th>
            <th>Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => {
            const isEdit = editId === role.id;
            return (
              <tr key={role.id}>
                <td>
                  {isEdit ? (
                    <input name="fullName" defaultValue={role.fullName} onChange={onChange} />
                  ) : (
                    role.fullName
                  )}
                </td>
                <td>
                  {isEdit ? (
                    <input name="shortName" defaultValue={role.shortName} onChange={onChange} />
                  ) : (
                    role.shortName
                  )}
                </td>
                <td>
                  {isEdit ? (
                    <input type="number" name="code" defaultValue={role.code} onChange={onChange} />
                  ) : (
                    role.code
                  )}
                </td>
                <td className="actions">
                  {isEdit ? (
                    <>
                      <button onClick={() => handleUpdate(role.id)}>Save</button>
                      <button className="cancel" onClick={() => setEditId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button disabled={editId !== null} onClick={() => { setEditId(role.id); setForm(role); }}>
                        Edit
                      </button>
                      <button disabled={editId !== null} className="delete" onClick={() => handleDelete(role.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}

          {addMode && (
            <tr className="add-row">
              <td><input name="fullName" onChange={onChange} /></td>
              <td><input name="shortName" onChange={onChange} /></td>
              <td><input name="code" type="number" onChange={onChange} /></td>
              <td className="actions">
                <button onClick={handleAdd}>Save</button>
                <button className="cancel" onClick={() => setAddMode(false)}>Cancel</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!addMode && <button className="add-btn" onClick={() => setAddMode(true)}>➕ Add</button>}
    </div>
  );
};
