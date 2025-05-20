// frontend/src/pages/QuestionPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getQuestionsByCourse, getCourseById } from '../services/api'; // getCourseById'ı da alalım kurs adını göstermek için
import './QuestionPage.css'; // Soru sayfası için CSS

function QuestionPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [courseTitle, setCourseTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(''); // MCQ için seçilen cevap
    const [fillBlankAnswer, setFillBlankAnswer] = useState(''); // FillBlank için girilen cevap
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    // const [feedback, setFeedback] = useState(''); // Cevap sonrası geri bildirim için

    const fetchCourseAndQuestions = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const courseRes = await getCourseById(courseId);
            if (courseRes.data && courseRes.data.success) {
                setCourseTitle(courseRes.data.data.name);
            } else {
                throw new Error(courseRes.data.message || 'Kurs bilgileri alınamadı.');
            }

            const questionsRes = await getQuestionsByCourse(courseId);
            if (questionsRes.data && questionsRes.data.success) {
                if (questionsRes.data.data.length > 0) {
                    setQuestions(questionsRes.data.data);
                    setCurrentQuestionIndex(0); // İlk sorudan başla
                } else {
                    // Kursta soru yoksa farklı bir mesaj gösterilebilir veya CourseDetail'e geri yönlendirilebilir.
                    setError('Bu kursta henüz soru bulunmamaktadır.');
                    setQuestions([]);
                }
            } else {
                throw new Error(questionsRes.data.message || 'Sorular yüklenirken bir sorun oluştu.');
            }
        } catch (err) {
            console.error("Failed to fetch course/questions:", err);
            setError(err.message || 'Veriler yüklenemedi. Sunucu hatası olabilir.');
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [courseId, navigate]);

    useEffect(() => {
        fetchCourseAndQuestions();
    }, [fetchCourseAndQuestions]); // useCallback kullandığımız için fetchCourseAndQuestions'ı dependency yapabiliriz

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerSubmit = (e) => {
        e.preventDefault();
        // TODO: Cevabı backend'e gönderip kontrol etme ve geri bildirim alma mantığı buraya gelecek.
        // Şimdilik sadece bir sonraki soruya geçelim (eğer varsa)
        console.log("Submitted answer:", currentQuestion.question_type === 'MCQ' ? selectedAnswer : fillBlankAnswer);
        // setFeedback(''); // Geri bildirimi temizle

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(''); // Seçimi sıfırla
            setFillBlankAnswer(''); // Girişi sıfırla
        } else {
            alert("Tebrikler! Bu kurstaki tüm soruları tamamladınız.");
            navigate(`/courses/${courseId}`); // Kurs detay sayfasına geri dön
        }
    };

    if (loading) {
        return <div className="question-page-container"><p>Sorular yükleniyor...</p></div>;
    }

    if (error) {
        return (
            <div className="question-page-container">
                <p className="error-message">{error}</p>
                <Link to={`/courses/${courseId}`}>Kurs Detaylarına Geri Dön</Link>
            </div>
        );
    }

    if (!currentQuestion) {
        // Bu durum, fetch bittiğinde questions dizisi hala boşsa (örn: kursta soru yoksa) oluşabilir.
        // fetchCourseAndQuestions içinde setError ile zaten ele alınıyor ama ekstra bir kontrol.
        return (
            <div className="question-page-container">
                <p>Bu kurs için soru bulunamadı veya yüklenirken bir sorun oluştu.</p>
                <Link to={`/courses/${courseId}`}>Kurs Detaylarına Geri Dön</Link>
            </div>
        );
    }

    return (
        <div className="question-page-container">
            <Link to={`/courses/${courseId}`} className="back-to-course-detail">
                {'<'} {courseTitle || 'Kurs Detayları'}
            </Link>
            <h1>Soru {currentQuestionIndex + 1} / {questions.length}</h1>
            <div className="question-content">
                <p className="question-text">{currentQuestion.question_text.replace('___', '_____')}</p> {/* Boşluğu daha belirgin yap */}

                <form onSubmit={handleAnswerSubmit}>
                    {currentQuestion.question_type === 'MCQ' && currentQuestion.options && (
                        <div className="mcq-options">
                            {currentQuestion.options.map((option, index) => (
                                <label key={index} className="mcq-option">
                                    <input
                                        type="radio"
                                        name="mcqAnswer"
                                        value={option}
                                        checked={selectedAnswer === option}
                                        onChange={(e) => setSelectedAnswer(e.target.value)}
                                        required
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    )}

                    {currentQuestion.question_type === 'FillBlank' && (
                        <div className="fill-blank-input">
                            <input
                                type="text"
                                value={fillBlankAnswer}
                                onChange={(e) => setFillBlankAnswer(e.target.value)}
                                placeholder="Cevabınızı buraya yazın"
                                required
                                autoFocus
                            />
                        </div>
                    )}
                    {/* Diğer soru tipleri için (örn: code-snippet) buraya eklenebilir */}

                    <button type="submit" className="submit-answer-button">
                        Cevapla ve Devam Et
                    </button>
                </form>
            </div>
            {/* {feedback && <p className="feedback-message">{feedback}</p>} */}
        </div>
    );
}

export default QuestionPage;