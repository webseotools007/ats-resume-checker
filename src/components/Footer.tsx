

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-50 to-indigo-100 border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          {/* Main Description */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-700">
              Professional-grade resume analysis and optimization powered by AI.
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Your resume data is processed securely and not stored.
            </p>
          </div>
          
          {/* Copyright Section */}
          <div className="text-xs text-gray-500">
            <p>
              © {new Date().getFullYear()} ATS Resume Checker by{" "}
              <a 
                href="https://skillunlock.net/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
              >
                SkillUnlock
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
