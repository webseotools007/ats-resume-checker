import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Target, Zap, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">About ATS Resume Checker</h1>
          <p className="text-xl text-gray-600">
            Empowering job seekers with AI-powered resume optimization
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Target className="h-6 w-6" />
              <span>Our Mission</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg leading-relaxed text-blue-900">
              We believe every job seeker deserves to have their resume
              optimized for success. Our AI-powered platform helps you create
              ATS-friendly resumes that get past Applicant Tracking Systems and
              into the hands of hiring managers.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-emerald-800">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Smart Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-700">
                Our advanced AI analyzes your resume structure, content, and
                formatting to identify areas for improvement and ATS
                compatibility.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border border-yellow-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-800">
                <Zap className="h-5 w-5 text-yellow-600" />
                <span>Instant Feedback</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700">
                Get immediate, actionable feedback on your resume with detailed
                recommendations and keyword analysis.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Target className="h-5 w-5 text-green-600" />
                <span>ATS Optimization</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700">
                Ensure your resume passes through Applicant Tracking Systems
                with our specialized ATS compatibility scoring and optimization
                tips.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border border-purple-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-purple-800">
                <Shield className="h-5 w-5 text-purple-600" />
                <span>Privacy First</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700">
                Your resume data is processed securely and never stored. We
                prioritize your privacy and data protection.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
