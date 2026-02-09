import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GetAll.css";

const CATEGORY_OPTIONS = [
  { id: 1, name: "Commercial" },
  { id: 2, name: "IT" },
  { id: 3, name: "Educate" },
  { id: 4, name: "Office" },
  { id: 5, name: "Academy" },
];

const LEVEL_OPTIONS = [
  { id: 2, name: "Beginner" },
  { id: 3, name: "Intermediate" },
  { id: 4, name: "Expert" },
];

// truncate text
const truncateText = (text, maxLength = 80) =>
  text && text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

export const GetAllCourse = () => {
  const navigate = useNavigate();
  const token = `Bearer ${localStorage.getItem("accessToken")}`;
  const [courses, setCourses] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    curriculum: "",
    categoryId: CATEGORY_OPTIONS[0].id,
    levelId: LEVEL_OPTIONS[0].id,
    photo: null,
  });

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const res = await axios.post(
        "https://localhost:7265/api/instructor/Course/GetAll",
        {},
        { headers: { Authorization: token } },
      );
      setCourses(res.data.rows);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ----------------- CREATE COURSE -----------------
  const handleNewCourseChange = (field, value) => {
    setNewCourse((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.curriculum || !newCourse.photo) {
      alert("Iltimos, barcha maydonlarni to‘ldiring va rasm tanlang!");
      return;
    }

    const formData = new FormData();
    formData.append("Title", newCourse.title);
    formData.append("Curriculum", newCourse.curriculum);
    formData.append("CategoryId", newCourse.categoryId);
    formData.append("LevelId", newCourse.levelId);
    formData.append("PhotoContent", newCourse.photo);

    try {
      await axios.post(
        "https://localhost:7265/api/instructor/Course/Create",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      fetchCourses();
      setIsAddModalOpen(false);
      setNewCourse({
        title: "",
        curriculum: "",
        categoryId: CATEGORY_OPTIONS[0].id,
        levelId: LEVEL_OPTIONS[0].id,
        photo: null,
      });
    } catch (error) {
      console.error(error);
      alert("Course yaratishda xatolik yuz berdi!");
    }
  };

  // ----------------- VIEW & EDIT -----------------
  const viewCourse = async (id) => {
    try {
      const res = await axios.get(
        `https://localhost:7265/api/instructor/Course/GetById/${id}`,
        { headers: { Authorization: token } },
      );

      setSelectedCourse(res.data);

      const categoryId =
        CATEGORY_OPTIONS.find((c) => c.name === res.data.categoryName)?.id ||
        CATEGORY_OPTIONS[0].id;
      const levelId =
        LEVEL_OPTIONS.find((l) => l.name === res.data.levelName)?.id ||
        LEVEL_OPTIONS[0].id;

      setEditedData({
        title: res.data.title,
        curriculum: res.data.curriculum,
        categoryId,
        levelId,
      });

      setIsEditEnabled(false);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (field, value) => {
    setEditedData((prev) => {
      const newData = { ...prev, [field]: value };

      if (!selectedCourse) return newData;

      const originalCategoryId =
        CATEGORY_OPTIONS.find((c) => c.name === selectedCourse.categoryName)
          ?.id || 0;
      const originalLevelId =
        LEVEL_OPTIONS.find((l) => l.name === selectedCourse.levelName)?.id || 0;

      const isChanged =
        newData.title !== selectedCourse.title ||
        newData.curriculum !== selectedCourse.curriculum ||
        newData.categoryId !== originalCategoryId ||
        newData.levelId !== originalLevelId;

      const categoryValid = CATEGORY_OPTIONS.some(
        (c) => c.id === newData.categoryId,
      );
      const levelValid = LEVEL_OPTIONS.some((l) => l.id === newData.levelId);

      setIsEditEnabled(isChanged && categoryValid && levelValid);
      return newData;
    });
  };

  const handleEdit = async () => {
    if (!isEditEnabled) return;

    const payload = {
      ...editedData,
      categoryName: CATEGORY_OPTIONS.find((c) => c.id === editedData.categoryId)
        .name,
      levelName: LEVEL_OPTIONS.find((l) => l.id === editedData.levelId).name,
    };

    try {
      await axios.put(
        `https://localhost:7265/api/instructor/Course/Update/${selectedCourse.id}`,
        payload,
        { headers: { Authorization: token } },
      );
      fetchCourses();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://localhost:7265/api/instructor/Course/Delete/${selectedCourse.id}`,
        { headers: { Authorization: token } },
      );
      fetchCourses();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const togglePublic = async () => {
    if (!selectedCourse) return;

    const makePublic = selectedCourse.statusName !== "Public";
    const url = makePublic
      ? `https://localhost:7265/api/instructor/Course/MakePublic/${selectedCourse.id}`
      : `https://localhost:7265/api/instructor/Course/MakeUnPublic/${selectedCourse.id}`;

    try {
      await axios.put(url, {}, { headers: { Authorization: token } });
      fetchCourses();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.put(
        `https://localhost:7265/api/instructor/Course/UpdatePhoto/${selectedCourse.id}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      fetchCourses();
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="courses-container">
      <button onClick={() => setIsAddModalOpen(true)}>Add Course</button>

      {/* ADD COURSE MODAL */}
      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsAddModalOpen(false)}>
              &times;
            </span>
            <h2>Add New Course</h2>

            <label>Title</label>
            <input
              value={newCourse.title}
              onChange={(e) => handleNewCourseChange("title", e.target.value)}
            />

            <label>Curriculum</label>
            <textarea
              value={newCourse.curriculum}
              onChange={(e) =>
                handleNewCourseChange("curriculum", e.target.value)
              }
            />

            <label>Category</label>
            <select
              value={newCourse.categoryId}
              onChange={(e) =>
                handleNewCourseChange("categoryId", parseInt(e.target.value))
              }
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <label>Level</label>
            <select
              value={newCourse.levelId}
              onChange={(e) =>
                handleNewCourseChange("levelId", parseInt(e.target.value))
              }
            >
              {LEVEL_OPTIONS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>

            <label>Photo</label>
            <input
              type="file"
              onChange={(e) =>
                handleNewCourseChange("photo", e.target.files[0])
              }
            />

            <div className="modal-buttons">
              <button onClick={handleCreateCourse}>Create</button>
              <button onClick={() => setIsAddModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* COURSES CARDS */}
      {courses.map((course) => (
        <div className="course-card" key={course.id}>
          <img
            src={`https://localhost:7265/api/public/Content/DownloadFile/${course.photoContentUrl}`}
            alt={course.title}
          />
          <h3>{course.title}</h3>
          <p>{truncateText(course.curriculum, 80)}</p>
          <p>Rating: {course.rating} ⭐</p>

          <p
            style={{
              color: course.statusName === "Public" ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {course.statusName}
          </p>

          <button onClick={() => viewCourse(course.id)}>View</button>

          <button
            onClick={() => navigate(`/instructor/courses/${course.id}/lessons`)}
          >
            Lessons
          </button>
        </div>
      ))}

      {/* MODAL → FULL DETAILS */}
      {isModalOpen && selectedCourse && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>
              &times;
            </span>

            <h2>Course Details</h2>

            <div className="photo-upload">
              <img
                src={`https://localhost:7265/api/public/Content/DownloadFile/${selectedCourse.photoContentUrl}`}
                alt={selectedCourse.title}
                onClick={() => document.getElementById("fileInput").click()}
              />
              <input
                id="fileInput"
                type="file"
                style={{ display: "none" }}
                onChange={handlePhotoUpload}
              />
            </div>

            <label>Title</label>
            <input
              value={editedData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />

            <label>Curriculum</label>
            <textarea
              value={editedData.curriculum}
              onChange={(e) => handleChange("curriculum", e.target.value)}
            />

            <label>Category</label>
            <select
              value={editedData.categoryId}
              onChange={(e) =>
                handleChange("categoryId", parseInt(e.target.value))
              }
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <label>Level</label>
            <select
              value={editedData.levelId}
              onChange={(e) =>
                handleChange("levelId", parseInt(e.target.value))
              }
            >
              {LEVEL_OPTIONS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>

            <div className="modal-buttons">
              <button onClick={handleEdit} disabled={!isEditEnabled}>
                Edit
              </button>
              <button onClick={handleDelete}>Delete</button>
              <button onClick={togglePublic}>Toggle Public</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/** Add Button Called Lessons that navigate to "/instructor/courses/:courseId/Lessons page" */
