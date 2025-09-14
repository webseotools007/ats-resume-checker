"use client";

import React, { useState, useEffect, useRef } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { ProSuggestions } from "@/components/ProSuggestions";
import { LoadingAnimation } from "@/components/LoadingAnimation";
import { PDFReport } from "@/components/PDFReport";
import { ResumeData } from "@/lib/gemini-service";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Download,
  Copy,
  Eye,
  Code,
  Sparkles,
  Target,
  Zap,
  Shield,
  Award,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Home() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs for GSAP animations
  const headerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const primaryButtonsRef = useRef<HTMLDivElement>(null);
  const secondaryButtonsRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // GSAP animations on mount
  useEffect(() => {
    if (!results) {
      const tl = gsap.timeline({ delay: 0.2 });

      // Animate banner
      tl.fromTo(
        bannerRef.current,
        { y: -50, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
      )

        // Animate title
        .fromTo(
          titleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.3"
        )

        // Animate description
        .fromTo(
          descriptionRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        )

        // Animate primary buttons
        .fromTo(
          primaryButtonsRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
          "-=0.2"
        )

        // Animate secondary buttons
        .fromTo(
          secondaryButtonsRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        )

        // Animate upload section
        .fromTo(
          uploadRef.current,
          { y: 40, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)" },
          "-=0.3"
        )

        // Animate stats
        .fromTo(
          statsRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        );

      // Add floating animation to action buttons
      if (primaryButtonsRef.current?.children) {
        gsap.to(primaryButtonsRef.current.children, {
          y: -10,
          duration: 2,
          ease: "power1.inOut",
          stagger: 0.1,
          yoyo: true,
          repeat: -1,
        });
      }
    }
  }, [results]);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/process-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process resume");
      }

      if (data.success && data.data) {
        setResults(data.data);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  const handleDownloadReport = async () => {
    try {
      // Create a temporary container for the PDF report
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = "800px";
      tempContainer.style.backgroundColor = "#ffffff";
      tempContainer.style.padding = "20px";
      tempContainer.style.fontFamily = "Arial, sans-serif";
      document.body.appendChild(tempContainer);

      // Render the PDFReport component into the temporary container
      const { createRoot } = await import("react-dom/client");
      const root = createRoot(tempContainer);
      root.render(<PDFReport data={results!} />);

      // Wait for the component to render
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Create canvas from the temporary container
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: 800,
        height: tempContainer.scrollHeight,
        logging: false,
      });

      // Clean up
      root.unmount();
      document.body.removeChild(tempContainer);

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190; // A4 width minus margins
      const pageHeight = 277; // A4 height minus margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position + 10, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download the PDF
      const fileName = `resume-analysis-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <>
      {/* Loading Animation */}
      <LoadingAnimation isProcessing={isProcessing} />
      <div className="w-full relative">
        {/* Your Content/Components */}
        <div className="container mx-auto px-4 py-8 z-40 relative max-w-7xl">
          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            {!results ? (
              <div className="space-y-16">
                {/* Hero Section */}
                <div ref={headerRef} className="text-center relative">
                  {/* Floating Elements */}
                  <div className="absolute -top-20 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute -top-10 right-1/4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>

                  {/* Enhanced New Features Banner */}
                  <div
                    ref={bannerRef}
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 shadow-xl border border-purple-200/50 hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping"></div>
                      <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ✨ AI-Powered Analysis
                    </span>
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-bounce">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-purple-600 group-hover:text-purple-800 transition-colors font-medium">
                      Live Now →
                    </span>
                  </div>

                  {/* Main Title */}
                  <h1 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                    <span className="text-gray-900 mb-2">Beat the </span>
                    <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                      ATS Game
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p
                    ref={descriptionRef}
                    className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10 font-medium"
                  >
                    Transform your resume with{" "}
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
                      AI-powered insights
                    </span>{" "}
                    and land your dream job faster than ever
                  </p>

                  {/* Main CTA Buttons - REMOVED */}
                </div>

                {/* Enhanced File Upload Section */}
                <div ref={uploadRef} className="max-w-2xl mx-auto">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 shadow-2xl border border-gray-200/50 backdrop-blur-sm">
                    <FileUpload
                      onFileSelect={handleFileSelect}
                      isProcessing={isProcessing}
                    />
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  <div className="group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-blue-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3 group-hover:rotate-6 transition-transform duration-300">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">ATS Optimized</h3>
                    <p className="text-gray-600 text-sm">Ensure your resume passes through all major ATS systems with our advanced scanning technology.</p>
                  </div>

                  <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-green-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-3 group-hover:rotate-6 transition-transform duration-300">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Feedback</h3>
                    <p className="text-gray-600 text-sm">Get professional-grade suggestions to improve your resume's impact and readability.</p>
                  </div>

                  <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-purple-100">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3 group-hover:rotate-6 transition-transform duration-300">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Results</h3>
                    <p className="text-gray-600 text-sm">Get detailed analysis and actionable insights in seconds, not hours.</p>
                  </div>
                </div>

                {/* Secondary Actions */}
                <div
                  ref={secondaryButtonsRef}
                  className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto"
                >
                  <Button
                    variant="outline"
                    className="group bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 text-gray-900 border border-gray-300 rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    onClick={() => router.push("/about")}
                  >
                    <Code className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Browse Features
                  </Button>
                </div>

                {/* Hidden file input for main upload button */}
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      handleFileSelect(files[0]);
                    }
                  }}
                  className="hidden"
                  disabled={isProcessing}
                />

                {/* Enhanced Error Display */}
                {error && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-red-800">
                        Error
                      </span>
                    </div>
                    <p className="text-red-700 mt-3 text-center">
                      {error}
                    </p>
                  </div>
                )}

                {/* Enhanced Statistics Section */}
                <div
                  ref={statsRef}
                  className="bg-gradient-to-r from-gray-50 to-white rounded-3xl p-8 shadow-2xl border border-gray-200/50 backdrop-blur-sm"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Trusted by Professionals</h3>
                    <p className="text-gray-600">Join thousands who've improved their job prospects</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="group text-center">
                      <div className="text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text group-hover:scale-110 transition-transform duration-300">
                        100+
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 mt-1 font-medium">
                        Resumes Analyzed
                      </div>
                    </div>
                    <div className="group text-center">
                      <div className="text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text group-hover:scale-110 transition-transform duration-300">
                        98%
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 mt-1 font-medium">
                        Success Rate
                      </div>
                    </div>
                    <div className="group text-center">
                      <div className="text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text group-hover:scale-110 transition-transform duration-300">
                        &lt;10s
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 mt-1 font-medium">
                        Analysis Time
                      </div>
                    </div>
                    <div className="group text-center">
                      <div className="text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text group-hover:scale-110 transition-transform duration-300">
                        FREE
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 mt-1 font-medium">
                        Forever
                      </div>
                    </div>
                  </div>
                  
                  {/* Trust indicators */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 pt-8 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium">100% Secure</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium">No Registration</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium">Instant Analysis</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">Open Source</span>
                    </div>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-gradient-to-r from-white to-gray-50 rounded-3xl p-8 shadow-2xl border border-gray-200/50 backdrop-blur-sm">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h3>
                    <p className="text-gray-600">Common questions about our ATS Resume Checker</p>
                  </div>
                  
                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">How does the ATS analysis work?</h4>
                      <p className="text-gray-600">Our AI analyzes your resume for ATS compatibility by checking formatting, keyword optimization, and structure. We provide a detailed score and specific recommendations for improvement.</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">Is my resume data secure?</h4>
                      <p className="text-gray-600">Yes, your resume data is processed securely and never stored on our servers. We use industry-standard encryption and privacy practices.</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">What file formats are supported?</h4>
                      <p className="text-gray-600">We support PDF, DOC, and DOCX formats. For best results, we recommend using PDF format as it maintains formatting consistency.</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">How long does the analysis take?</h4>
                      <p className="text-gray-600">Most resumes are analyzed within 10-30 seconds. Processing time may vary based on file size and complexity.</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">Is this service really free?</h4>
                      <p className="text-gray-600">Yes! Our ATS Resume Checker is completely free to use. No hidden fees, no registration required, and no limits on usage.</p>
                    </div>
                    
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                      <h4 className="text-lg font-bold text-gray-900 mb-3">Can I download my analysis report?</h4>
                      <p className="text-gray-600">Absolutely! After your resume is analyzed, you can download a detailed PDF report with all findings and recommendations.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Results Display */}
                {/* Action Buttons - Only show when results are available */}
                {results && (
                  <div className="flex justify-start space-x-3 mb-6">
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="sm"
                      className="bg-gray-100 backdrop-blur-xl border border-gray-300 text-gray-900 hover:bg-gray-200 hover:border-gray-400"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Another Resume
                    </Button>
                    <Button
                      onClick={handleDownloadReport}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                )}
                <ResultsDisplay data={results} onReset={handleReset} />

                {/* Pro Suggestions */}
                <ProSuggestions data={results} />
              </div>
            )}
          </div>

          {/* Enhanced Footer */}
          {/* Footer is now handled in layout.tsx */}
        </div>
      </div>
    </>
  );
}
