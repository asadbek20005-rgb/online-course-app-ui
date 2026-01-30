import React, { useEffect, useState } from "react";
import "./Level.css";

const emptyForm = { fullName: "", shortName: "", code: 0 };

export const Level = () => {
  const [levels, setLevels] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const token = localStorage.getItem("accessToken");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  /* ================= GET ALL ================= */
  const fetchLevels = async () => {
    try {
      const res = await fetch("https://localhost:7265/api/admin/Level/GetAll", { headers });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLevels(data);
    } catch {
      setError("❌ Data olishda xatolik yuz berdi");
    }
  };

  useEffect(() => {
    fetchLevels();
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
      const res = await fetch("https://localhost:7265/api/admin/Level/Create", {
        method: "POST",
        headers,
        body: JSON.stringify({
          fullName: form.fullName,
          shortName: form.shortName,
          code: Number(form.code),
        }),
      });
      if (!res.ok) throw new Error();
      await fetchLevels();
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
      const res = await fetch(`https://localhost:7265/api/admin/Level/Update?id=${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          fullName: form.fullName,
          shortName: form.shortName,
          code: Number(form.code),
        }),
      });
      if (!res.ok) throw new Error();
      await fetchLevels();
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
      const res = await fetch(`https://localhost:7265/api/admin/Level/Delete?id=${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error();
      await fetchLevels();
    } catch {
      setError("❌ Delete qilishda xatolik yuz berdi");
    }
  };

  return (
    <div className="level-wrapper">
      <h2>Levels</h2>

      {error && <div className="level-error">{error}</div>}

      <table className="level-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Short Name</th>
            <th>Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {levels.map((lvl) => {
            const isEdit = editId === lvl.id;
            return (
              <tr key={lvl.id}>
                <td>
                  {isEdit ? (
                    <input name="fullName" defaultValue={lvl.fullName} onChange={onChange} />
                  ) : (
                    lvl.fullName
                  )}
                </td>
                <td>
                  {isEdit ? (
                    <input name="shortName" defaultValue={lvl.shortName} onChange={onChange} />
                  ) : (
                    lvl.shortName
                  )}
                </td>
                <td>
                  {isEdit ? (
                    <input type="number" name="code" defaultValue={lvl.code} onChange={onChange} />
                  ) : (
                    lvl.code
                  )}
                </td>
                <td className="actions">
                  {isEdit ? (
                    <>
                      <button onClick={() => handleUpdate(lvl.id)}>Save</button>
                      <button className="cancel" onClick={() => setEditId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button disabled={editId !== null} onClick={() => { setEditId(lvl.id); setForm(lvl); }}>
                        Edit
                      </button>
                      <button disabled={editId !== null} className="delete" onClick={() => handleDelete(lvl.id)}>
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
