import { useState } from 'react';

const Quiz = ({ lesson, onSubmit, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questions = lesson.assessment?.questions || [];
  const question = questions[currentQuestion];

  const handleSelectAnswer = (optionIndex) => {
    setSelectedAnswer(optionIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = {
        questionIndex: currentQuestion,
        selectedAnswer: selectedAnswer
      };
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(newAnswers[currentQuestion + 1]?.selectedAnswer ?? null);
      } else {
        // Submit all answers
        onSubmit(newAnswers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]?.selectedAnswer ?? null);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredCount = answers.filter(a => a !== undefined).length;

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
        <button
          onClick={onBack}
          className="mb-4 flex items-center text-white hover:text-purple-100 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Lesson
        </button>
        
        <h1 className="text-2xl font-bold mb-2">Assessment: {lesson.title}</h1>
        <p className="text-purple-100">
          Question {currentQuestion + 1} of {questions.length}
        </p>
        <p className="text-sm text-purple-200 mt-1">
          Passing Score: {lesson.assessment.passingScore}% | Answered: {answeredCount}/{questions.length}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 h-2">
        <div
          className="bg-purple-500 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-3xl mx-auto">
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedAnswer === index
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300 bg-white'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === index && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-700 font-medium">{String.fromCharCode(65 + index)}.</span>
                      <span className="ml-2 text-gray-800">{option}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Assessment Guidelines</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Select the best answer for each question</li>
                  <li>You can navigate back to review previous questions</li>
                  <li>You must answer all questions before submitting</li>
                  <li>You'll receive immediate feedback after submission</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="border-t bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              currentQuestion === 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="text-sm text-gray-600">
            {selectedAnswer !== null ? (
              <span className="text-green-600 font-medium">✓ Answer selected</span>
            ) : (
              <span>Select an answer to continue</span>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              selectedAnswer !== null
                ? 'bg-purple-500 text-white hover:bg-purple-600 shadow-md'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentQuestion < questions.length - 1 ? (
              <>
                Next
                <svg className="w-5 h-5 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            ) : (
              <>
                Submit Assessment
                <svg className="w-5 h-5 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
