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
import { StudentLayout } from "./Components/Student/Layout/Layout";
import { EnrollCourse } from "./Components/Student/Course/EnrollCourse/EnrollCourse";
import { CourseDetails } from "./Components/Student/Course/CourseDetails/CourseDetails";
import { MyCourses } from "./Components/Student/Course/MyCourses/MyCourses";
import { Register } from "./Components/Public/Auth/Register/Register";
import { MyCourseDetails } from "./Components/Student/Course/MyCourseDetails/MyCourseDetails";
import { MyLessons } from "./Components/Student/MyLessons/MyLessons";
import { MyLessonDetails } from "./Components/Student/MyLessonDetails/MyLessonDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

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

        <Route path="/student" element={<StudentLayout />}>
          <Route path="enroll" element={<EnrollCourse />} />
          <Route path="courses/:courseId/details" element={<CourseDetails/>}/>
          <Route path="my-courses" element={<MyCourses/>}/>
          <Route path="my-courses/:courseId" element={<MyCourseDetails/>}/>
          <Route path="my-courses/:courseId/my-lessons" element={<MyLessons/>}/>
          <Route path="my-courses/:courseId/my-lessons/:lessonId" element={<MyLessonDetails/>}/>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
