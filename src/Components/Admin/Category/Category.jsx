import React, { useEffect, useState } from 'react';
import './Category.css';

export const Category = () => {
  const [categories, setCategories] = useState([]);
  const [original, setOriginal] = useState([]);
  const [error, setError] = useState('');
  const [creatingId, setCreatingId] = useState(null);

  const token = localStorage.getItem('accessToken');

  const loadCategories = () => {
    fetch('https://localhost:7265/api/admin/Category/GetAll', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => a.id - b.id);
        setCategories(sorted);
        setOriginal(JSON.parse(JSON.stringify(sorted)));
      })
      .catch(err => setError(err.message));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (id, field, value) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const isChanged = (id) => {
  const a = categories.find(c => c.id === id);
  const b = original.find(c => c.id === id);

  if (!a) return false; // safety, agar category yo'q bo'lsa
  if (!b) return true;  // yangi row -> doim true

  return a.fullName !== b.fullName || a.shortName !== b.shortName || a.code !== b.code;
};

  const handleUpdate = (id) => {
    const category = categories.find(c => c.id === id);

    fetch(`https://localhost:7265/api/admin/Category/Update?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName: category.fullName,
        shortName: category.shortName,
        code: category.code,
      }),
    })
      .then(async res => {
        const text = await res.text(); // plain text
        if (!res.ok) throw new Error(text || 'Update failed');
        setOriginal(prev => prev.map(c => (c.id === id ? { ...category } : c)));
      })
      .catch(err => setError(err.message));
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete category?')) return;

    fetch(`https://localhost:7265/api/admin/Category/Delete?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        const text = await res.text(); // plain text
        if (!res.ok) throw new Error(text || 'Delete failed');
        setCategories(prev => prev.filter(c => c.id !== id));
        setOriginal(prev => prev.filter(c => c.id !== id));
        setError('');
      })
      .catch(err => setError(err.message));
  };

  const handleAdd = () => {
    const tempId = Math.random();
    setCreatingId(tempId);

    const newCategory = {
      id: tempId,
      fullName: '',
      shortName: '',
      code: '',
    };

    setCategories(prev => [...prev, newCategory]);
  };

  const handleSaveNew = (category) => {
    if (!category.fullName || !category.shortName || !category.code) {
      setError('All fields are required for new category.');
      return;
    }

    fetch(`https://localhost:7265/api/admin/Category/Create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName: category.fullName,
        shortName: category.shortName,
        code: Number(category.code),
      }),
    })
      .then(async res => {
        const text = await res.text(); // plain text
        if (!res.ok) throw new Error(text || 'Create failed');

        // Agar backend faqat matn yuborsa, qayta yuklaymiz
        loadCategories();
        setCreatingId(null);
        setError('');
      })
      .catch(err => setError(err.message));
  };

  const handleCancelNew = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    setCreatingId(null);
    setError('');
  };

  return (
    <div className="page">
      <div className="header">
        <h2>Categories</h2>
        <button className="btn btn-primary" onClick={handleAdd}>+ Create</button>
      </div>

      {error && <div className="error">{error}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Short Name</th>
            <th>Code</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.length === 0 && (
            <tr>
              <td colSpan="5" className="empty">No categories</td>
            </tr>
          )}

          {categories.map(c => (
            <tr key={c.id}>
              <td>{Number.isInteger(c.id) ? c.id : '-'}</td>
              <td>
                <input
                  value={c.fullName}
                  onChange={(e) => handleChange(c.id, 'fullName', e.target.value)}
                />
              </td>
              <td>
                <input
                  value={c.shortName}
                  onChange={(e) => handleChange(c.id, 'shortName', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={c.code}
                  onChange={(e) => handleChange(c.id, 'code', e.target.value)}
                />
              </td>
              <td className="actions">
                {creatingId === c.id ? (
                  <>
                    <button className="btn btn-edit" onClick={() => handleSaveNew(c)}>Save</button>
                    <button className="btn btn-cancel" onClick={() => handleCancelNew(c.id)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-edit"
                      disabled={!isChanged(c.id)}
                      onClick={() => handleUpdate(c.id)}
                    >
                      Edit
                    </button>
                    <button className="btn btn-delete" onClick={() => handleDelete(c.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
