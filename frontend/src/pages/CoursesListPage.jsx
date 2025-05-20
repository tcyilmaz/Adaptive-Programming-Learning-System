import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCourses } from '../services/api'; // api.js'den fonksiyonu import et
import './CoursesListPage.css'; // Kurs listesi için CSS dosyası

function CoursesListPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await getAllCourses();
                if (response.data && response.data.success) {
                    setCourses(response.data.data);
                } else {
                    setError(response.data.message || 'Kurslar yüklenirken bir sorun oluştu.');
                }
            } catch (err) {
                console.error("Failed to fetch courses:", err);
                setError('Kurslar yüklenemedi. Sunucu hatası olabilir.');
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    navigate('/login'); // Yetkilendirme hatası varsa login'e yönlendir
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [navigate]);

    if (loading) {
        return <div className="courses-list-container"><p>Kurslar yükleniyor...</p></div>;
    }

    if (error) {
        return <div className="courses-list-container"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="courses-list-container">
            <h1>Tüm Kurslar</h1>
            {courses.length === 0 ? (
                <p>Henüz mevcut kurs bulunmamaktadır.</p>
            ) : (
                <ul className="courses-list">
                    {courses.map((course) => (
                        <li key={course.course_id} className="course-item">
                            <Link to={`/courses/${course.course_id}`}>
                                <h2>{course.name}</h2>
                                <p className="course-language">Dil: {course.language}</p>
                                <p className="course-description">{course.description || 'Açıklama bulunmamaktadır.'}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CoursesListPage;