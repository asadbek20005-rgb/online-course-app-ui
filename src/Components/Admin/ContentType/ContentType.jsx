import React, { useEffect, useState } from "react";
import "./ContentType.css";

const API = "https://localhost:7265/api/admin/ContentType";

const emptyForm = { fullName: "", shortName: "", code: 0, typeName: "" };

export const ContentType = () => {
  const [data, setData] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const token = localStorage.getItem("accessToken");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  /* ================= GET ALL ================= */
  const fetchData = async () => {
    try {
      const res = await fetch(`${API}/GetAll`, { headers });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setData(json);
    } catch {
      setError("❌ Data olishda xatolik yuz berdi");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= ADD ================= */
  const handleAdd = async () => {
    setError("");
    if (!form.fullName || !form.shortName || !form.typeName) {
      setError("❗ Barcha maydonlarni to‘ldiring");
      return;
    }

    try {
      const res = await fetch(`${API}/Create`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          fullName: form.fullName,
          shortName: form.shortName,
          code: Number(form.code),
          typeName: form.typeName,
        }),
      });
      if (!res.ok) throw new Error();

      await fetchData();
      setAddMode(false);
      setForm(emptyForm);
    } catch {
      setError("❌ Add qilishda xatolik yuz berdi");
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async (id) => {
    setError("");
    try {
      const res = await fetch(`${API}/Update?id=${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          fullName: form.fullName,
          shortName: form.shortName,
          code: Number(form.code),
        }),
      });
      if (!res.ok) throw new Error();

      await fetchData();
      setEditId(null);
      setForm(emptyForm);
    } catch {
      setError("❌ Update qilishda xatolik");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Rostdan ham o‘chirmoqchimisiz?")) return;

    try {
      const res = await fetch(`${API}/Delete?id=${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error();

      await fetchData();
    } catch {
      setError("❌ Delete qilishda xatolik");
    }
  };

  return (
    <div className="ct-wrapper">
      <h2>Content Types</h2>

      {error && <div className="ct-error">{error}</div>}

      <table className="ct-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Short Name</th>
            <th>Code</th>
            <th>Type Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const isEdit = editId === item.id;

            return (
              <tr key={item.id}>
                <td>
                  {isEdit ? <input name="fullName" defaultValue={item.fullName} onChange={onChange} /> : item.fullName}
                </td>
                <td>
                  {isEdit ? <input name="shortName" defaultValue={item.shortName} onChange={onChange} /> : item.shortName}
                </td>
                <td>
                  {isEdit ? <input type="number" name="code" defaultValue={item.code} onChange={onChange} /> : item.code}
                </td>
                <td>{item.typeName}</td>
                <td className="actions">
                  {isEdit ? (
                    <>
                      <button onClick={() => handleUpdate(item.id)}>Save</button>
                      <button className="cancel" onClick={() => setEditId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button disabled={editId !== null} onClick={() => { setEditId(item.id); setForm(item); }}>Edit</button>
                      <button disabled={editId !== null} className="delete" onClick={() => handleDelete(item.id)}>Delete</button>
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
              <td><input name="typeName" onChange={onChange} /></td>
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
