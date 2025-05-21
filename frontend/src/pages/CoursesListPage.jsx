import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCourses } from '../services/api';
import './CoursesListPage.css'; 

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
                    setError(response.data.message || 'Can not load the courses.');
                }
            } catch (err) {
                console.error("Failed to fetch courses:", err);
                setError('Can not load the courses');
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [navigate]);

    if (loading) {
        return <div className="courses-list-container"><p>Loading courses...</p></div>;
    }

    if (error) {
        return <div className="courses-list-container"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="courses-list-container">
            <h1>All Courses</h1>
            {courses.length === 0 ? (
                <p>No courses found</p>
            ) : (
                <ul className="courses-list">
                    {courses.map((course) => (
                        <li key={course.course_id} className="course-item">
                            <Link to={`/courses/${course.course_id}`}>
                                <h2>{course.name}</h2>
                                <p className="course-language">Language: {course.language}</p>
                                <p className="course-description">{course.description || 'No describtion'}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CoursesListPage;