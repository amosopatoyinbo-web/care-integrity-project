const QuizResults = ({ lesson, results, onRetry, onBackToLessons }) => {
  const { score, passed, passingScore, attemptNumber, results: questionResults } = results;

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`text-white p-8 ${passed ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'}`}>
        <div className="max-w-4xl mx-auto text-center">
          {passed ? (
            <>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-2">Congratulations!</h1>
              <p className="text-xl text-green-50">You passed the assessment</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-2">Keep Learning!</h1>
              <p className="text-xl text-orange-50">You didn't pass this time, but you can try again</p>
            </>
          )}
        </div>
      </div>

      {/* Score Display */}
      <div className="bg-gray-50 border-b p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-gray-800 mb-1">{score}%</div>
              <div className="text-sm text-gray-600">Your Score</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-gray-800 mb-1">{passingScore}%</div>
              <div className="text-sm text-gray-600">Passing Score</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {questionResults.filter(r => r.isCorrect).length}/{questionResults.length}
              </div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>
          </div>

          {passed && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-green-800">
                <p className="font-semibold">Certificate Issued!</p>
                <p>A certificate has been added to your profile. You can view it in the Certificates tab.</p>
              </div>
            </div>
          )}

          {attemptNumber > 1 && (
            <div className="mt-4 text-center text-sm text-gray-600">
              Attempt #{attemptNumber}
            </div>
          )}
        </div>
      </div>

      {/* Question Review */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Your Answers</h2>
          
          <div className="space-y-6">
            {questionResults.map((result, index) => {
              const question = lesson.assessment.questions[result.questionIndex];
              
              return (
                <div
                  key={index}
                  className={`rounded-lg border-2 p-6 ${
                    result.isCorrect
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex-1">
                      Question {index + 1}: {question.question}
                    </h3>
                    <div className={`ml-4 px-3 py-1 rounded-full text-sm font-semibold ${
                      result.isCorrect
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optIndex) => {
                      const isSelected = result.selectedAnswer === optIndex;
                      const isCorrect = result.correctAnswer === optIndex;
                      
                      let className = 'p-3 rounded-lg border ';
                      if (isCorrect) {
                        className += 'border-green-500 bg-green-100';
                      } else if (isSelected && !isCorrect) {
                        className += 'border-red-500 bg-red-100';
                      } else {
                        className += 'border-gray-200 bg-white';
                      }

                      return (
                        <div key={optIndex} className={className}>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700 mr-2">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <span className="flex-1">{option}</span>
                            {isCorrect && (
                              <span className="text-green-600 font-semibold ml-2">
                                ✓ Correct Answer
                              </span>
                            )}
                            {isSelected && !isCorrect && (
                              <span className="text-red-600 font-semibold ml-2">
                                Your Answer
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {result.explanation && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-blue-900 mb-1">Explanation:</p>
                      <p className="text-sm text-blue-800">{result.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto flex justify-center gap-4">
          <button
            onClick={onBackToLessons}
            className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-all"
          >
            Back to Lessons
          </button>
          {!passed && (
            <button
              onClick={onRetry}
              className="px-6 py-3 rounded-lg font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-all shadow-md"
            >
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry Assessment
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
