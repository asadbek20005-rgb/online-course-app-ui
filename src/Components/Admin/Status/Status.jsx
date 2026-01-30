import React, { useEffect, useState } from "react";
import "./Status.css";

const emptyForm = { fullName: "", shortName: "", code: 0 };

export const Status = () => {
  const [statuses, setStatuses] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const token = localStorage.getItem("accessToken");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  /* ================= GET ALL ================= */
  const fetchStatuses = async () => {
    try {
      const res = await fetch("https://localhost:7265/api/admin/Status/GetAll", { headers });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStatuses(data);
    } catch {
      setError("❌ Data olishda xatolik yuz berdi");
    }
  };

  useEffect(() => {
    fetchStatuses();
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
      const res = await fetch("https://localhost:7265/api/admin/Status/Create", {
        method: "POST",
        headers,
        body: JSON.stringify({
          fullName: form.fullName,
          shortName: form.shortName,
          code: Number(form.code),
        }),
      });
      if (!res.ok) throw new Error();
      await fetchStatuses();
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
      const res = await fetch(`https://localhost:7265/api/admin/Status/Update?id=${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          fullName: form.fullName,
          shortName: form.shortName,
          code: Number(form.code),
        }),
      });
      if (!res.ok) throw new Error();
      await fetchStatuses();
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
      const res = await fetch(`https://localhost:7265/api/admin/Status/Delete?id=${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error();
      await fetchStatuses();
    } catch {
      setError("❌ Delete qilishda xatolik yuz berdi");
    }
  };

  return (
    <div className="status-wrapper">
      <h2>Statuslar</h2>

      {error && <div className="status-error">{error}</div>}

      <table className="status-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Short Name</th>
            <th>Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {statuses.map((status) => {
            const isEdit = editId === status.id;
            return (
              <tr key={status.id}>
                <td>
                  {isEdit ? (
                    <input name="fullName" defaultValue={status.fullName} onChange={onChange} />
                  ) : (
                    status.fullName
                  )}
                </td>
                <td>
                  {isEdit ? (
                    <input name="shortName" defaultValue={status.shortName} onChange={onChange} />
                  ) : (
                    status.shortName
                  )}
                </td>
                <td>
                  {isEdit ? (
                    <input type="number" name="code" defaultValue={status.code} onChange={onChange} />
                  ) : (
                    status.code
                  )}
                </td>
                <td className="actions">
                  {isEdit ? (
                    <>
                      <button onClick={() => handleUpdate(status.id)}>Save</button>
                      <button className="cancel" onClick={() => setEditId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button disabled={editId !== null} onClick={() => { setEditId(status.id); setForm(status); }}>
                        Edit
                      </button>
                      <button disabled={editId !== null} className="delete" onClick={() => handleDelete(status.id)}>
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
