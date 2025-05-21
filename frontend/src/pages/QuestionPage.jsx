// frontend/src/pages/QuestionPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getQuestionsByCourse, getCourseById, submitAnswer } from '../services/api';
import './QuestionPage.css';

function QuestionPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [courseTitle, setCourseTitle] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(''); // MCQ için
    const [fillBlankAnswer, setFillBlankAnswer] = useState(''); // FillBlank için
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [feedback, setFeedback] = useState(null); // { message: string, isCorrect: boolean }
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Veri çekme fonksiyonu (useCallback ile sarmalandı)
    const fetchCourseAndQuestions = useCallback(async () => {
        setLoading(true);
        setError('');
        setQuestions([]); // Yeni kursa geçerken veya yeniden yüklerken eski soruları temizle
        setCourseTitle(''); // Eski başlığı temizle
        setCurrentQuestionIndex(0); // İndeksi sıfırla
        setFeedback(null); // Eski feedback'i temizle

        try {
            // Önce kurs bilgilerini çek (başlık için)
            const courseRes = await getCourseById(courseId);
            if (courseRes.data && courseRes.data.success) {
                setCourseTitle(courseRes.data.data.name);
            } else {
                // Kurs bilgisi alınamazsa da devam et ama bir hata logla veya kullanıcıya bildir
                console.warn(courseRes.data.message || 'Kurs başlığı alınamadı.');
                // setError('Kurs başlığı yüklenemedi.'); // Bu kullanıcıya gösterilecek genel hatayı tetikler
            }

            // Sonra soruları çek
            const questionsRes = await getQuestionsByCourse(courseId);
            if (questionsRes.data && questionsRes.data.success) {
                if (questionsRes.data.data && questionsRes.data.data.length > 0) {
                    setQuestions(questionsRes.data.data);
                } else {
                    // Kursta soru yoksa, error state'ini set et ve questions'ı boş bırak
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
    }, [courseId, navigate]); // useCallback bağımlılıkları

    // Bileşen yüklendiğinde ve courseId değiştiğinde verileri çek
    useEffect(() => {
        if (courseId) { // courseId varsa fetch yap
            fetchCourseAndQuestions();
        }
    }, [fetchCourseAndQuestions, courseId]); // fetchCourseAndQuestions ve courseId'ye bağımlı

    // Mevcut soruyu al (questions dizisi boş değilse)
    const currentQuestion = questions.length > 0 && currentQuestionIndex < questions.length
        ? questions[currentQuestionIndex]
        : null;

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        if (!currentQuestion || isSubmitting) return;

        setIsSubmitting(true);
        setFeedback(null);
        setError(''); // Cevap gönderirken genel API hatalarını temizle

        const answerToSubmit = currentQuestion.question_type === 'MCQ' ? selectedAnswer : fillBlankAnswer;

        try {
            const response = await submitAnswer(currentQuestion.question_id, answerToSubmit);
            if (response.data && response.data.success) {
                setFeedback({
                    message: response.data.isCorrect
                        ? 'True!'
                        : `Wrong! Right answer is: ${response.data.correctAnswer}`,
                    isCorrect: response.data.isCorrect,
                });
            } else {
                // API'den success:false ama hata mesajı geldiyse
                setFeedback({
                    message: response.data.message || 'Cevap gönderilirken bir sorun oluştu.',
                    isCorrect: false // Hata durumunda yanlış kabul edelim
                });
            }
        } catch (err) {
            console.error("Failed to submit answer:", err);
            // Genel bir hata mesajı göster veya feedback'i ayarla
            setFeedback({
                message: 'Cevap gönderilemedi. Sunucu hatası olabilir.',
                isCorrect: false
            });
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                navigate('/login');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextQuestion = () => {
        setFeedback(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer('');
            setFillBlankAnswer('');
        } else {
            alert("Congrats! You finished this course.");
            navigate(`/courses/${courseId}`); // Kurs detay sayfasına geri dön
        }
    };

    if (loading) {
        return <div className="question-page-container"><p>Yükleniyor...</p></div>;
    }

    // Önce genel API veya yükleme hatasını kontrol et
    if (error && questions.length === 0) { // Eğer questions yüklenemediyse ve genel bir hata varsa
        return (
            <div className="question-page-container">
                <p className="error-message">{error}</p>
                <Link to="/courses">Tüm Kurslara Dön</Link>
            </div>
        );
    }

    // Sorular yüklendi ama hiç soru yoksa (veya error spesifik olarak 'soru yok' ise)
    if (questions.length === 0) {
        return (
            <div className="question-page-container">
                <h1>{courseTitle || 'Kurs'}</h1>
                <p className="error-message">{error || 'Bu kursta henüz soru bulunmamaktadır.'}</p>
                <Link to={`/courses/${courseId}`}>Kurs Detaylarına Geri Dön</Link>
            </div>
        );
    }

    // Eğer buraya kadar geldiysek ve currentQuestion hala null ise, bir sorun var demektir.
    // Bu genellikle questions dizisi boşken veya index hatalıysa olur ama yukarıdaki kontrollerle ele alınmalı.
    if (!currentQuestion) {
        return (
            <div className="question-page-container">
                <p>Soru yüklenirken beklenmedik bir sorun oluştu. Lütfen sayfayı yenileyin veya kurs listesine geri dönün.</p>
                <Link to="/courses">Kurs Listesine Dön</Link>
            </div>
        );
    }

    return (
        <div className="question-page-container">
                        <Link to={`/courses/${courseId}`} className="back-to-course-detail">
                {'<'} {courseTitle || 'Kurs Detayları'}
            </Link>
            <h1>Question {currentQuestionIndex + 1} / {questions.length}</h1>
            {/* Cevap gönderimi sırasında oluşan spesifik API hataları için: */}
            {error && feedback === null && <p className="error-message">{error}</p>}

            <div className="question-content">
                {/* currentQuestion null değilse question_text'e eriş */}
                <p className="question-text">{currentQuestion.question_text?.replace('___', ' _____ ')}</p>

                {!feedback && (
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
                                    placeholder="Write your answer here"
                                    required
                                    autoFocus
                                />
                            </div>
                        )}
                        <button type="submit" className="submit-answer-button" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Answer'}
                        </button>
                    </form>
                )}

                {feedback && (
                    <div className={`feedback-message ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
                        <p>{feedback.message}</p>
                        <button onClick={handleNextQuestion} className="next-question-button">
                            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Course'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuestionPage;