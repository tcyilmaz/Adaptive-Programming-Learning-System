// frontend/src/pages/CourseDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourseById } from "../services/api";
import "./CourseDetailPage.css";

function CourseDetailPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getCourseById(courseId);
        if (response.data && response.data.success) {
          setCourse(response.data.data);
        } else {
          setError(
            response.data.message || `Can not find (ID: ${courseId}).`
          );
        }
      } catch (err) {
        console.error(`Failed to fetch course ${courseId}:`, err);
        setError(`Can not find (ID: ${courseId}).`);
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          navigate("/login");
        } else if (err.response && err.response.status === 404) {
          setError(`Can not find (ID: ${courseId}).`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, navigate]);

  if (loading) {
    return (
      <div className="course-detail-container">
        <p>Course loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-detail-container">
        <p className="error-message">{error}</p>{" "}
        <Link to="/courses">Return to Main Menu</Link>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-detail-container">
        <p>Course not found.</p> <Link to="/courses">Return to Main Menu</Link>
      </div>
    );
  }
  const handleStartCourse = () => {
    navigate(`/courses/${courseId}/play`);
  };

  return (
    <div className="course-detail-container">
      <Link to="/courses" className="back-to-courses-link">
        {"<"} All Courses
      </Link>
      <h1>{course.name}</h1>
      <p className="course-language-detail">
        <strong>Language:</strong> {course.language}
      </p>
      <div className="course-description-detail">
        <h3>Description</h3>
        <p>{course.description || "No Describtion."}</p>
      </div>
      <div className="course-actions">
        <button onClick={handleStartCourse} className="start-course-button">
          Start Course
        </button>
      </div>
    </div>
  );
}

export default CourseDetailPage;
