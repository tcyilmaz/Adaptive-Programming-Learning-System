// frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api.js'; // Ensure this path and extension are correct

function DashboardPage() {
    console.log("DashboardPage: Component rendering/rerendering"); // 1. Is component even rendering?
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        console.log("DashboardPage: useEffect triggered"); // 2. Is useEffect running?

        // Get user info from localStorage (existing logic)
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                setUser(storedUser);
            } else {
                console.log("DashboardPage: No stored user, navigating to login");
                navigate('/login');
            }
        } catch (error) {
            console.error("DashboardPage: Failed to parse user data", error);
            navigate('/login');
        }

        const fetchCourses = async () => {
            console.log("DashboardPage: fetchCourses called"); // 3. Is fetchCourses called?
            try {
                setError(''); // Clear previous errors
                console.log("DashboardPage: Attempting to fetch /api/courses"); // 4. About to make API call
                const response = await apiClient.get('/courses');
                console.log("DashboardPage: API response received:", response); // 5. What's the raw response?
                if (response && response.data) {
                    console.log("DashboardPage: Setting courses data:", response.data); // 6. Data to be set
                    setCourses(response.data);
                } else {
                    console.error("DashboardPage: API response missing data property");
                    setError('Failed to parse course data from server.');
                }
            } catch (err) {
                console.error("DashboardPage: Failed to fetch courses (in catch block):", err); // 7. API call failed
                console.error("DashboardPage: Error response data:", err.response?.data);
                console.error("DashboardPage: Error response status:", err.response?.status);
                setError('Could not load courses. Please try again later.');
                if (err.response?.status === 401) {
                    console.log("DashboardPage: Unauthorized (401), logging out.");
                    // handleLogout(); // Assuming handleLogout is defined or implement here
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    navigate('/login');
                }
            } finally {
                console.log("DashboardPage: fetchCourses finally block, setting loading to false"); // 8. Finally block reached?
                setLoading(false);
            }
        };

        fetchCourses();
    }, [navigate]);

    console.log("DashboardPage: State before return - loading:", loading, "error:", error, "courses:", courses.length); // 9. State before rendering

    if (loading) {
        console.log("DashboardPage: Rendering 'Loading Dashboard...'");
        return <div style={{ textAlign: 'center', padding: '20px' }}>Loading Dashboard...</div>;
    }

    if (error) {
        console.log("DashboardPage: Rendering error message:", error);
        return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Error: {error}</div>;
    }

    // ... (rest of your rendering logic for courses) ...
    return (
        <div>
            <h2>Dashboard</h2>
            {user ? <p>Welcome, {user.username}!</p> : <p>Welcome!</p>}
            {/* ... existing logout button logic ... */}
            <hr />
            <h3>Available Courses</h3>
            {courses.length > 0 ? (
                <ul>
                    {courses.map((course) => (
                        <li key={course.course_id}>
                            <Link to={`/learn/${course.course_id}`}>
                                <h4>{course.name} ({course.language})</h4>
                            </Link>
                            <p>{course.description}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No courses available at the moment, or data failed to load.</p>
            )}
        </div>
    );
}
export default DashboardPage;