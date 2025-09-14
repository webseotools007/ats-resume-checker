"use client";

import React from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Target,
  Lightbulb,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ResumeData } from "@/lib/gemini-service";

interface ResultsDisplayProps {
  data: ResumeData;
  onReset: () => void;
}

export function ResultsDisplay({ data, onReset }: ResultsDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-6 w-6 text-green-600" />;
    if (score >= 60)
      return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
    return <XCircle className="h-6 w-6 text-red-600" />;
  };

  // Show error message if it's not a resume
  if (!data.is_resume) {
    return (
      <div className="space-y-6 w-full max-w-4xl mx-auto">
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <XCircle className="h-6 w-6 text-red-600" />
              <span>Document Type Error</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-lg text-red-700 font-medium">
                {data.message ||
                  "This document does not appear to be a resume or CV."}
              </p>
              <p className="text-gray-600">
                Please upload a resume or CV document for ATS compatibility
                analysis.
              </p>
              <Button
                onClick={onReset}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
              >
                Upload Different File
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* Overall Score */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Target className="h-6 w-6 text-blue-600" />
            <span>ATS Compatibility Score</span>
          </CardTitle>
          <CardDescription className="text-blue-600">
            Your resume&apos;s compatibility with Applicant Tracking Systems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getScoreIcon(data?.ats_analysis?.score || 0)}
                <span
                  className={`text-3xl font-bold ${getScoreColor(
                    data?.ats_analysis?.score || 0
                  )}`}
                >
                  {data?.ats_analysis?.score || 0}/100
                </span>
              </div>
              <div className="text-sm font-medium px-3 py-1 rounded-full bg-white/70 text-gray-700">
                {(data?.ats_analysis?.score || 0) >= 80
                  ? "Excellent"
                  : (data?.ats_analysis?.score || 0) >= 60
                  ? "Good"
                  : (data?.ats_analysis?.score || 0) >= 40
                  ? "Fair"
                  : "Needs Improvement"}
              </div>
            </div>
            <Progress
              value={data?.ats_analysis?.score}
              max={100}
              className="h-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      {data?.header?.name && (
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-emerald-800">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-bold text-lg text-emerald-900">{data?.header?.name}</p>
                <p className="text-sm text-emerald-700 flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                  {data?.header?.email}
                </p>
                <p className="text-sm text-emerald-700 flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                  {data?.header?.phone}
                </p>
                <p className="text-sm text-emerald-700 flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                  {data?.header?.location}
                </p>
              </div>
              {(data?.header?.linkedin || data?.header?.website) && (
                <div className="space-y-2">
                  {data?.header?.linkedin && (
                    <p className="text-sm">
                      <a
                        href={data?.header?.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      >
                        🔗 LinkedIn Profile
                      </a>
                    </p>
                  )}
                  {data?.header?.website && (
                    <p className="text-sm">
                      <a
                        href={data?.header?.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      >
                        🌐 Personal Website
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues */}
        <Card className="bg-gradient-to-br from-red-50 to-pink-100 border border-red-200 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <XCircle className="h-5 w-5 text-red-600" />
              <span>Issues Found</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.ats_analysis?.issues?.length || 0) > 0 ? (
              <ul className="space-y-3">
                {data?.ats_analysis?.issues?.map((issue, index) => (
                  <li key={index} className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg">
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-red-800 leading-relaxed">{issue}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium">No major issues found!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border border-yellow-200 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              <span>Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.ats_analysis?.recommendations?.length || 0) > 0 ? (
              <ul className="space-y-3">
                {data?.ats_analysis?.recommendations?.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-yellow-800 leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium">
                  No specific recommendations at this time.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Keyword Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Found Keywords */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>
                Keywords Found ({data?.ats_analysis?.keyword_matches?.length || 0})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.ats_analysis?.keyword_matches?.length || 0) > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data?.ats_analysis?.keyword_matches?.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 text-sm rounded-full border border-green-300 font-medium shadow-sm"
                  >
                    ✓ {keyword}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium">No keywords detected</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Missing Keywords */}
        <Card className="bg-gradient-to-br from-orange-50 to-yellow-100 border border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>
                Missing Keywords ({data?.ats_analysis?.missing_keywords?.length || 0})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.ats_analysis?.missing_keywords?.length || 0) > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data?.ats_analysis?.missing_keywords?.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-orange-100 to-yellow-200 text-orange-800 text-sm rounded-full border border-orange-300 font-medium shadow-sm"
                  >
                    + {keyword}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium">
                  No missing keywords identified
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Skills Section */}
      {data?.sections?.skills && (
        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-purple-800">Skills Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data?.sections?.skills?.technical?.length > 0 && (
                <div>
                  <h4 className="font-bold mb-3 text-purple-900 text-lg flex items-center">
                    💻 Technical Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data?.sections?.skills?.technical?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-gradient-to-r from-blue-100 to-cyan-200 text-blue-800 text-sm rounded-full border border-blue-300 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {data?.sections?.skills?.soft?.length > 0 && (
                <div>
                  <h4 className="font-bold mb-3 text-purple-900 text-lg flex items-center">
                    🧠 Soft Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data?.sections?.skills?.soft?.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-200 text-purple-800 text-sm rounded-full border border-purple-300 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {data?.sections?.skills?.languages &&
                data?.sections?.skills?.languages?.length > 0 && (
                  <div>
                    <h4 className="font-bold mb-3 text-purple-900 text-lg flex items-center">
                      🌍 Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {data?.sections?.skills?.languages?.map(
                        (language, index) => (
                          <span
                            key={index}
                            className="px-3 py-2 bg-gradient-to-r from-green-100 to-teal-200 text-green-800 text-sm rounded-full border border-green-300 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                          >
                            {language}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
