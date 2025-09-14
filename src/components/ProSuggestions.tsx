"use client";

import React, { useState } from "react";
import {
  Crown,
  Lock,
  CheckCircle,
  Star,
  Zap,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResumeData } from "@/lib/gemini-service";

interface ProSuggestionsProps {
  data: ResumeData;
  isProMode?: boolean;
}

export function ProSuggestions({
  data,
  isProMode = true,
}: ProSuggestionsProps) {
  const [showAllSuggestions, setShowAllSuggestions] = useState(isProMode);

  // Don't show pro suggestions if it's not a resume
  if (!data.is_resume) {
    return null;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-gradient-to-r from-red-100 to-pink-200 text-red-800 border-red-300";
      case "High":
        return "bg-gradient-to-r from-orange-100 to-yellow-200 text-orange-800 border-orange-300";
      case "Medium":
        return "bg-gradient-to-r from-blue-100 to-cyan-200 text-blue-800 border-blue-300";
      case "Low":
        return "bg-gradient-to-r from-gray-100 to-slate-200 text-gray-800 border-gray-300";
      default:
        return "bg-gradient-to-r from-gray-100 to-slate-200 text-gray-800 border-gray-300";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "Critical":
        return <Zap className="h-4 w-4" />;
      case "High":
        return <Star className="h-4 w-4" />;
      case "Medium":
        return <CheckCircle className="h-4 w-4" />;
      case "Low":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  // Use real AI data if available, otherwise fallback to static data
  const proSuggestions = data.pro_suggestions?.categories || [
    {
      category: "Header Optimization",
      priority: "High" as const,
      suggestions: [
        "Move contact information to the very top of the resume",
        "Use a professional email format (firstname.lastname@email.com)",
        "Include a professional LinkedIn URL",
        "Add a location that matches job requirements",
      ],
      impact: "Improves ATS parsing by 25%",
    },
    {
      category: "Experience Section",
      priority: "High" as const,
      suggestions: [
        "Use action verbs at the beginning of each bullet point",
        "Include quantifiable achievements with numbers and percentages",
        "Add industry-specific keywords naturally",
        "Keep bullet points to 1-2 lines maximum",
      ],
      impact: "Increases keyword matching by 40%",
    },
    {
      category: "Skills Section",
      priority: "Medium" as const,
      suggestions: [
        "Create separate sections for technical and soft skills",
        "Include proficiency levels (Beginner, Intermediate, Expert)",
        "Add emerging technologies relevant to your field",
        "Use industry-standard skill names",
      ],
      impact: "Boosts skill recognition by 30%",
    },
  ];

  const summary = data.pro_suggestions?.summary || {
    total_categories: proSuggestions.length,
    total_suggestions: proSuggestions.reduce(
      (sum, cat) => sum + cat.suggestions.length,
      0
    ),
    potential_score_increase: 25,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Crown className="h-6 w-6 text-yellow-600" />
            <CardTitle className="text-2xl font-bold text-purple-800">
              AI-Powered Resume Optimization
            </CardTitle>
          </div>
          <CardDescription className="text-purple-700">
            Get personalized suggestions to make your resume 100% ATS-friendly
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Pro Features Preview */}
      {!showAllSuggestions && (
        <Card className="border-2 border-dashed border-gray-300 bg-gradient-to-br from-indigo-50 to-purple-100 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Lock className="h-8 w-8 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                Pro Features Locked
              </h3>
            </div>
            <p className="text-gray-700 mb-6 max-w-md mx-auto">
              Unlock advanced AI suggestions and personalized recommendations to
              transform your resume into an ATS magnet.
            </p>
            <Button
              onClick={() => setShowAllSuggestions(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Crown className="h-4 w-4 mr-2" />
              Unlock Pro Features (Testing Mode)
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Pro Suggestions */}
      {showAllSuggestions && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Your Personalized AI Optimization Plan
            </h2>
            <p className="text-gray-700">
              Based on your resume analysis, here are the specific changes to
              maximize your ATS compatibility
            </p>
          </div>

          {proSuggestions.map((category, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-slate-50 to-gray-100 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant="outline"
                      className={getPriorityColor(category.priority)}
                    >
                      {getPriorityIcon(category.priority)}
                      <span className="ml-1">{category.priority}</span>
                    </Badge>
                    <div>
                      <CardTitle className="text-lg text-gray-900">
                        {category.category}
                      </CardTitle>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      {category.impact}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.suggestions.map((suggestion, suggestionIndex) => (
                    <div
                      key={suggestionIndex}
                      className="flex items-start space-x-3 p-4 bg-white/80 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-800 leading-relaxed">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Summary */}
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200 shadow-xl">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-emerald-900">
                  Action Plan Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/80 rounded-lg p-4 border border-emerald-200 shadow-sm">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {summary.total_categories}
                    </div>
                    <div className="text-sm text-gray-700">
                      Categories to Optimize
                    </div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-4 border border-emerald-200 shadow-sm">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {summary.total_suggestions}
                    </div>
                    <div className="text-sm text-gray-700">
                      Specific Suggestions
                    </div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-4 border border-emerald-200 shadow-sm">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      +{summary.potential_score_increase}
                    </div>
                    <div className="text-sm text-gray-700">
                      Potential Score Increase
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  Implement these suggestions to transform your resume from good
                  to exceptional ATS compatibility
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
