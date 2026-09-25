const CertificateCard = ({ certificate }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      professionalism: 'from-blue-500 to-blue-600',
      safety: 'from-red-500 to-red-600',
      communication: 'from-green-500 to-green-600',
      ethics: 'from-purple-500 to-purple-600',
      skills: 'from-orange-500 to-orange-600',
      compliance: 'from-gray-500 to-gray-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-gray-200 hover:shadow-xl transition-all">
      {/* Certificate Header */}
      <div className={`bg-gradient-to-r ${getCategoryColor(certificate.category)} text-white p-6`}>
        <div className="flex items-center justify-between mb-4">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            certificate.status === 'active' ? 'bg-white bg-opacity-30' : 'bg-red-500'
          }`}>
            {certificate.status === 'active' ? '✓ ACTIVE' : 'EXPIRED'}
          </span>
        </div>
        <h3 className="text-2xl font-bold mb-2">{certificate.title}</h3>
        <p className="text-sm opacity-90">
          {certificate.category.charAt(0).toUpperCase() + certificate.category.slice(1)}
        </p>
      </div>

      {/* Certificate Body */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Certificate Number</p>
            <p className="font-mono text-sm font-semibold text-gray-800">{certificate.certificateNumber}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Score Achieved</p>
            <p className="text-2xl font-bold text-green-600">{certificate.score}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Issued Date</p>
            <p className="text-sm font-medium text-gray-800">{formatDate(certificate.issuedAt)}</p>
          </div>
          {certificate.expiresAt && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Expires</p>
              <p className="text-sm font-medium text-gray-800">{formatDate(certificate.expiresAt)}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <button
            onClick={() => window.print()}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(certificate.certificateNumber);
              alert('Certificate number copied to clipboard!');
            }}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
