import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const LessonViewer = ({ lesson, onComplete, onBack }) => {
  const [startTime] = useState(Date.now());
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = (e) => {
      const element = e.target;
      const scrollPercentage = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
      setScrollProgress(Math.min(scrollPercentage, 100));
    };

    const contentElement = document.getElementById('lesson-content');
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleComplete = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 60000); // minutes
    onComplete(timeSpent);
  };

  const getCategoryColor = (category) => {
    const colors = {
      professionalism: 'bg-blue-100 text-blue-800',
      safety: 'bg-red-100 text-red-800',
      communication: 'bg-green-100 text-green-800',
      ethics: 'bg-purple-100 text-purple-800',
      skills: 'bg-orange-100 text-orange-800',
      compliance: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
        <button
          onClick={onBack}
          className="mb-4 flex items-center text-white hover:text-green-100 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Lessons
        </button>
        
        <h1 className="text-3xl font-bold mb-3">{lesson.title}</h1>
        <p className="text-green-50 mb-4">{lesson.description}</p>
        
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(lesson.category)}`}>
            {lesson.category.charAt(0).toUpperCase() + lesson.category.slice(1)}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(lesson.difficulty)}`}>
            {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {lesson.duration} min
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 h-2">
        <div
          className="bg-green-500 h-full transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Content */}
      <div
        id="lesson-content"
        className="flex-1 overflow-y-auto p-8"
        style={{ maxHeight: 'calc(100vh - 300px)' }}
      >
        <div className="max-w-4xl mx-auto prose prose-lg">
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </div>

        {lesson.resources && lesson.resources.length > 0 && (
          <div className="max-w-4xl mx-auto mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">Additional Resources</h3>
            <ul className="space-y-2">
              {lesson.resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {scrollProgress >= 80 ? (
              <span className="text-green-600 font-medium">
                ✓ You've read most of the lesson
              </span>
            ) : (
              <span>
                Scroll to continue reading ({Math.round(scrollProgress)}% complete)
              </span>
            )}
          </div>
          <button
            onClick={handleComplete}
            disabled={scrollProgress < 80}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              scrollProgress >= 80
                ? 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Take Assessment
            <svg className="w-5 h-5 inline ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
