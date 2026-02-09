import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./Components/Public/Auth/Login/Login";
import { Category } from "./Components/Admin/Category/Category";
import { ContentType } from "./Components/Admin/ContentType/ContentType";
import { Level } from "./Components/Admin/Level/Level";
import { Role } from "./Components/Admin/Role/Role";
import { Status } from "./Components/Admin/Status/Status";
import { Sidebar } from "./Components/Admin/Sidebar/Sidebar";
import { GetAllCourse } from "./Components/Instructor/Course/GetAll/GetAll";
import { Lesson } from "./Components/Instructor/Lesson/Lesson/Lesson";
import { Layout } from "./Components/Instructor/Layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<Sidebar />}>
          <Route path="category" element={<Category />} />
          <Route path="content-type" element={<ContentType />} />
          <Route path="level" element={<Level />} />
          <Route path="role" element={<Role />} />
          <Route path="status" element={<Status />} />
        </Route>

        <Route path="/instructor" element={<Layout />}>
          <Route path="course" element={<GetAllCourse />} />
          <Route path="courses/:courseId/lessons" element={<Lesson />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;