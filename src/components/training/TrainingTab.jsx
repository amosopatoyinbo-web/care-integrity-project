import { useState, useEffect } from 'react';
import trainingApi from '../../lib/trainingApi';
import LessonViewer from './LessonViewer';
import Quiz from './Quiz';
import QuizResults from './QuizResults';
import ProgressTracker from './ProgressTracker';
import CertificateCard from './CertificateCard';

const TrainingTab = () => {
  const [view, setView] = useState('list'); // list, lesson, quiz, results, progress, certificates
  const [lessons, setLessons] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessonTimeSpent, setLessonTimeSpent] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [lessonsData, progressArray, certsData] = await Promise.all([
        trainingApi.getLessons(),
        trainingApi.getProgress(),
        trainingApi.getCertificates()
      ]);
      setLessons(lessonsData);
      setProgressData(progressArray);
      setCertificates(certsData);
    } catch (err) {
      setError(err.message || 'Failed to load training data');
    } finally {
      setLoading(false);
    }
  };

  const handleStartLesson = async (lesson) => {
    try {
      setSelectedLesson(lesson);
      const progress = await trainingApi.startLesson(lesson._id);
      setCurrentProgress(progress);
      setView('lesson');
    } catch (err) {
      setError(err.message || 'Failed to start lesson');
    }
  };

  const handleContinueLesson = async (lesson) => {
    try {
      const progress = await trainingApi.getLessonProgress(lesson._id);
      setCurrentProgress(progress);
      setSelectedLesson(lesson);
      
      // If already completed, go straight to quiz
      if (progress.status === 'completed') {
        setView('lesson'); // Can review lesson
      } else {
        setView('lesson');
      }
    } catch (err) {
      setError(err.message || 'Failed to continue lesson');
    }
  };

  const handleLessonComplete = (timeSpent) => {
    setLessonTimeSpent(timeSpent);
    setView('quiz');
  };

  const handleQuizSubmit = async (answers) => {
    try {
      const results = await trainingApi.submitAssessment(
        selectedLesson._id,
        answers,
        lessonTimeSpent
      );
      setQuizResults(results);
      setView('results');
      // Reload progress data to show updated stats
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to submit assessment');
    }
  };

  const handleRetryQuiz = () => {
    setView('lesson');
    setLessonTimeSpent(0);
  };

  const handleBackToLessons = () => {
    setView('list');
    setSelectedLesson(null);
    setCurrentProgress(null);
    setQuizResults(null);
    setLessonTimeSpent(0);
  };

  const getCategoryColor = (category) => {
    const colors = {
      professionalism: 'bg-blue-100 text-blue-800 border-blue-300',
      safety: 'bg-red-100 text-red-800 border-red-300',
      communication: 'bg-green-100 text-green-800 border-green-300',
      ethics: 'bg-purple-100 text-purple-800 border-purple-300',
      skills: 'bg-orange-100 text-orange-800 border-orange-300',
      compliance: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getLessonStatus = (lessonId) => {
    const progress = progressData.find(p => p.lessonId._id === lessonId || p.lessonId === lessonId);
    return progress || { status: 'not_started' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading training content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-800 font-medium">{error}</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Render different views
  if (view === 'lesson' && selectedLesson) {
    return (
      <LessonViewer
        lesson={selectedLesson}
        onComplete={handleLessonComplete}
        onBack={handleBackToLessons}
      />
    );
  }

  if (view === 'quiz' && selectedLesson) {
    return (
      <Quiz
        lesson={selectedLesson}
        onSubmit={handleQuizSubmit}
        onBack={() => setView('lesson')}
      />
    );
  }

  if (view === 'results' && quizResults) {
    return (
      <QuizResults
        lesson={selectedLesson}
        results={quizResults}
        onRetry={handleRetryQuiz}
        onBackToLessons={handleBackToLessons}
      />
    );
  }

  if (view === 'progress') {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => setView('list')}
            className="flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Lessons
          </button>
        </div>
        <ProgressTracker progressData={progressData} />
      </div>
    );
  }

  if (view === 'certificates') {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => setView('list')}
            className="flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Lessons
          </button>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Certificates</h2>
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map(cert => (
              <CertificateCard key={cert._id} certificate={cert} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Certificates Yet</h3>
            <p className="text-gray-600">Complete lessons and pass assessments to earn certificates</p>
          </div>
        )}
      </div>
    );
  }

  // Default: Lesson List View
  const completedCount = progressData.filter(p => p.status === 'completed').length;
  const totalLessons = lessons.length;
  const completionPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div>
      {/* Header Stats */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Care Integrity Standards Training</h2>
        <p className="text-gray-600 mb-6">
          Complete professional development courses and earn certificates to enhance your caregiving credentials.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Progress</p>
                <p className="text-3xl font-bold">{completionPercentage}%</p>
              </div>
              <svg className="w-12 h-12 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <button
            onClick={() => setView('progress')}
            className="bg-white border-2 border-blue-300 rounded-lg p-6 text-left hover:border-blue-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Completed</p>
                <p className="text-3xl font-bold text-blue-600">{completedCount}/{totalLessons}</p>
              </div>
              <svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => setView('certificates')}
            className="bg-white border-2 border-purple-300 rounded-lg p-6 text-left hover:border-purple-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Certificates</p>
                <p className="text-3xl font-bold text-purple-600">{certificates.length}</p>
              </div>
              <svg className="w-12 h-12 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </button>

          <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Lessons</p>
                <p className="text-3xl font-bold text-gray-800">{totalLessons}</p>
              </div>
              <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="space-y-4">
        {lessons.map(lesson => {
          const status = getLessonStatus(lesson._id);
          const isCompleted = status.status === 'completed';
          const isInProgress = status.status === 'in_progress';
          const bestScore = status.bestScore;

          return (
            <div
              key={lesson._id}
              className="bg-white rounded-lg border-2 border-gray-200 hover:border-green-300 hover:shadow-md transition-all overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(lesson.category)}`}>
                        {lesson.category.charAt(0).toUpperCase() + lesson.category.slice(1)}
                      </span>
                      <span className="text-sm text-gray-600">
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {lesson.duration} min
                      </span>
                      <span className="text-sm text-gray-600">
                        {lesson.assessment.questions.length} questions
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{lesson.title}</h3>
                    <p className="text-gray-600 mb-4">{lesson.description}</p>

                    {isCompleted && bestScore !== undefined && (
                      <div className="flex items-center gap-4 mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Completed
                        </span>
                        <span className="text-sm text-gray-700">
                          <svg className="w-4 h-4 inline mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Best Score: {bestScore}%
                        </span>
                        {status.certificateIssued && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Certified
                          </span>
                        )}
                      </div>
                    )}

                    {isInProgress && !isCompleted && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 mb-4">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        In Progress
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => isInProgress || isCompleted ? handleContinueLesson(lesson) : handleStartLesson(lesson)}
                    className={`ml-6 px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
                      isCompleted
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : isInProgress
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {isCompleted ? 'Review Lesson' : isInProgress ? 'Continue' : 'Start Lesson'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Lessons Available</h3>
          <p className="text-gray-600">Training content will appear here when available</p>
        </div>
      )}
    </div>
  );
};

export default TrainingTab;
