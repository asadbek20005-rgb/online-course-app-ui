import React, { useEffect, useState } from "react";
import {
  getCourseById,
  updateCourse,
  deleteCourse,
  updatePhoto,
  makePublic,
  makeUnPublic,
} from "./courseApi";
import { categories, levels } from "./constants";

const CourseModal = ({ id, onClose }) => {
  const [course, setCourse] = useState(null);
  const [form, setForm] = useState({});
  const [changed, setChanged] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    getCourseById(id).then(res => {
      setCourse(res.data);
      setForm(res.data);
    });
  }, [id]);

  const onChange = (k, v) => {
    setForm(prev => ({ ...prev, [k]: v }));
    setChanged(true);
  };

  const save = async () => {
    await updateCourse(id, {
      title: form.title,
      curriculum: form.curriculum,
      categoryId: form.categoryId,
      levelId: form.levelId,
    });
    setChanged(false);
    onClose();
  };

  const remove = async () => {
    if (window.confirm("Are you sure?")) {
      await deleteCourse(id);
      onClose();
    }
  };

  if (!course) return null;

  return (
    <div className="backdrop">
      <div className="modal">
        <img
          src={`https://localhost:7265/api/public/Content/DownloadFile/${course.photoContentUrl}`}
          onClick={() => document.getElementById("file").click()}
        />

        <input
          type="file"
          id="file"
          hidden
          onChange={(e) => updatePhoto(id, e.target.files[0])}
        />

        <input
          value={form.title || ""}
          onChange={(e) => onChange("title", e.target.value)}
        />

        <textarea
          value={form.curriculum || ""}
          onChange={(e) => onChange("curriculum", e.target.value)}
        />

        <select onChange={e => onChange("categoryId", +e.target.value)}>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select onChange={e => onChange("levelId", +e.target.value)}>
          {levels.map(l => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>

        <div className="actions">
          <button disabled={!changed} onClick={save}>Edit</button>
          <button onClick={remove}>Delete</button>
          <button
            onClick={() => {
              isPublic ? makeUnPublic(id) : makePublic(id);
              setIsPublic(!isPublic);
            }}
          >
            {isPublic ? "UnPublic" : "Public"}
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;
