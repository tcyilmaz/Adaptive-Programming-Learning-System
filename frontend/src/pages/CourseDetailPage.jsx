// frontend/src/pages/CourseDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCourseById } from "../services/api";
import "./CourseDetailPage.css"; // Detay sayfası için CSS

function CourseDetailPage() {
  const { courseId } = useParams(); // URL'den courseId'yi al
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseId) return; // courseId yoksa bir şey yapma

    const fetchCourseDetails = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getCourseById(courseId);
        if (response.data && response.data.success) {
          setCourse(response.data.data);
        } else {
          setError(
            response.data.message || `Kurs (ID: ${courseId}) bulunamadı.`
          );
        }
      } catch (err) {
        console.error(`Failed to fetch course ${courseId}:`, err);
        setError(`Kurs (ID: ${courseId}) yüklenemedi. Sunucu hatası olabilir.`);
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          navigate("/login");
        } else if (err.response && err.response.status === 404) {
          setError(`Kurs (ID: ${courseId}) bulunamadı.`);
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
    // Kullanıcıyı kursun soru sayfasına yönlendir
    // State ile soru listesini de gönderebiliriz veya QuestionPage kendi fetch edebilir
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
        {/* İleride bu butona tıklandığında sorular sayfasına yönlendireceğiz */}
        <button onClick={handleStartCourse} className="start-course-button">
          Start Course
        </button>
      </div>
      {/* İleride kursa ait modüller/sorular burada listelenebilir */}
    </div>
  );
}

export default CourseDetailPage;
