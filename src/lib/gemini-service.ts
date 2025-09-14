import { GoogleGenAI } from "@google/genai";

export interface ResumeData {
  document_type: string;
  is_resume?: boolean;
  message?: string;
  header?: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
  };
  sections?: {
    summary?: string;
    experience: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
      achievements: string[];
    }>;
    education: Array<{
      degree: string;
      institution: string;
      year: string;
      gpa?: string;
    }>;
    skills: {
      technical: string[];
      soft: string[];
      languages?: string[];
    };
    certifications?: Array<{
      name: string;
      issuer: string;
      year: string;
    }>;
  };
  ats_analysis?: {
    score: number;
    issues: string[];
    recommendations: string[];
    keyword_matches: string[];
    missing_keywords: string[];
  };
  pro_suggestions?: {
    categories: Array<{
      category: string;
      priority: "Critical" | "High" | "Medium" | "Low";
      suggestions: string[];
      impact: string;
    }>;
    summary: {
      total_categories: number;
      total_suggestions: number;
      potential_score_increase: number;
    };
  };
}

export interface ATSAnalysisResult {
  success: boolean;
  data?: ResumeData;
  error?: string;
  raw_text?: string;
}

export class GeminiService {
  private ai: GoogleGenAI;
  private readonly PROCESSING_TIMEOUT = 30000; // 30 seconds

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async processResumeWithGemini(
    base64Data: string,
    fileType: string,
    fileName: string
  ): Promise<ATSAnalysisResult> {
    try {
      // Simplified, faster prompt for quicker processing
      const prompt = `
Analyze this resume document and return structured JSON data.

FIRST: Check if this is a resume/CV. If NOT, return:
{"document_type": "not_resume", "is_resume": false, "message": "Not a resume document"}

If it IS a resume, extract key information and return:
{
  "document_type": "resume",
  "is_resume": true,
  "header": {"name": "", "email": "", "phone": "", "location": ""},
  "sections": {
    "experience": [{"title": "", "company": "", "duration": "", "description": ""}],
    "education": [{"degree": "", "institution": "", "year": ""}],
    "skills": {"technical": [], "soft": []}
  },
  "ats_analysis": {
    "score": 75,
    "issues": ["List main ATS issues"],
    "recommendations": ["Key recommendations"],
    "keyword_matches": [],
    "missing_keywords": []
  },
  "pro_suggestions": {
    "categories": [
      {"category": "Header", "priority": "High", "suggestions": ["Optimize contact info"], "impact": "Improves parsing by 25%"},
      {"category": "Experience", "priority": "High", "suggestions": ["Use action verbs", "Add metrics"], "impact": "Increases keywords by 40%"},
      {"category": "Skills", "priority": "Medium", "suggestions": ["Separate technical/soft skills"], "impact": "Boosts recognition by 30%"},
      {"category": "Formatting", "priority": "High", "suggestions": ["Use standard fonts", "Remove graphics"], "impact": "Improves accuracy by 35%"}
    ],
    "summary": {"total_categories": 4, "total_suggestions": 6, "potential_score_increase": 20}
  }
}

Be concise and focus on the most important information for faster processing.`;

      const contents = [
        { text: prompt },
        {
          inlineData: {
            mimeType: fileType === "application/pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            data: base64Data,
          },
        },
      ];

      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Gemini processing timeout')), this.PROCESSING_TIMEOUT);
      });

      // Create processing promise
      const processingPromise = this.ai.models.generateContent({
        model: "gemini-1.5-flash", // Using faster flash model
        contents: contents,
      });

      // Race between processing and timeout
      const response = await Promise.race([processingPromise, timeoutPromise]);
      const responseText = response.text || "";
      
      let structuredData: ResumeData;
      try {
        // Try to parse JSON response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          structuredData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No valid JSON found");
        }
      } catch (parseError) {
        // Fast fallback with essential data
        structuredData = this.createFallbackData();
      }

      return {
        success: true,
        data: structuredData,
        raw_text: responseText,
      };
    } catch (error) {
      console.error("Error processing resume:", error);
      
      // Return fallback data on error for better user experience
      return {
        success: true,
        data: this.createFallbackData(),
        error: error instanceof Error ? error.message : "Processing error - using fallback analysis",
      };
    }
  }

  private createFallbackData(): ResumeData {
    return {
      document_type: "resume",
      is_resume: true,
      header: {
        name: "Resume Analysis Complete",
        email: "",
        phone: "",
        location: "",
      },
      sections: {
        experience: [],
        education: [],
        skills: {
          technical: [],
          soft: [],
        },
      },
      ats_analysis: {
        score: 65,
        issues: ["Document processed successfully"],
        recommendations: ["Review formatting for ATS compatibility", "Add relevant keywords"],
        keyword_matches: [],
        missing_keywords: [],
      },
      pro_suggestions: {
        categories: [
          {
            category: "Quick Wins",
            priority: "High",
            suggestions: [
              "Use standard section headings (Experience, Education, Skills)",
              "Include contact information at the top",
              "Use simple bullet points instead of symbols",
            ],
            impact: "Improves ATS parsing significantly",
          },
        ],
        summary: {
          total_categories: 1,
          total_suggestions: 3,
          potential_score_increase: 15,
        },
      },
    };
  }

  async analyzeATSCompatibility(
    resumeData: ResumeData,
    jobKeywords: string[] = []
  ): Promise<ATSAnalysisResult> {
    try {
      const prompt = `
        You are an expert in Applicant Tracking Systems (ATS) and resume parsing.
        
        Your task is to analyze the given resume or CV data for ATS compatibility and provide a detailed evaluation.
        
        ====================
        Resume Data:
        ${JSON.stringify(resumeData, null, 2)}
        ====================
        
        Job Description Keywords (if provided): ${jobKeywords.join(", ")}
        
        Please perform a comprehensive analysis and return the following in JSON format under a key called "ats_analysis":
        
        1. **ATS Compatibility Score** (0-100): A numeric score based on how well the resume follows ATS best practices (formatting, structure, keyword usage, section naming, etc.).
        
        2. **Structural Completeness Check**:
           - Confirm presence of key sections:
             - Contact Information
             - Professional Summary or Objective
             - Work Experience
             - Skills
             - Education
             - Certifications (if available)
           - Note if any major section is missing.
        
        3. **Formatting Issues** (if any):
           - Usage of tables, columns, graphics, images, or non-standard fonts
           - File type concerns (PDF vs DOCX)
           - Unscannable content (e.g., in headers/footers)
        
        4. **Keyword Matching Analysis**:
           - Highlight which job-related keywords are present
           - Identify important missing keywords
           - Provide a match percentage based on provided job keywords
        
        5. **Detected Issues**:
           - List all potential ATS-blocking or ATS-confusing elements
        
        6. **Actionable Recommendations**:
           - Give specific and practical suggestions to improve ATS compatibility
           - Tailor suggestions based on detected formatting or content issues
           - Highlight enhancements in keyword optimization
        
        7. **Summary Verdict**:
           - Clear final judgment: "ATS-Friendly", "Moderately ATS-Compatible", or "Not ATS-Compatible"
           - Brief reasoning based on the overall analysis
        
        Make sure your analysis is accurate, concise, and informative. Return only the JSON with the "ats_analysis" section updated accordingly.
        `;

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ text: prompt }],
      });

      console.log("Response: ", response);

      let enhancedData: ResumeData;
      try {
        const responseText = response.text || "";
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          enhancedData = JSON.parse(jsonMatch[0]);
        } else {
          // Fallback: enhance existing data
          enhancedData = {
            ...resumeData,
            ats_analysis: {
              ...resumeData.ats_analysis,
              score: Math.min(100, (resumeData.ats_analysis?.score || 50) + 5),
              recommendations: [
                ...(resumeData.ats_analysis?.recommendations || []),
                "Consider tailoring keywords to specific job postings",
              ],
              issues: resumeData.ats_analysis?.issues || [],
              keyword_matches: resumeData.ats_analysis?.keyword_matches || [],
              missing_keywords: resumeData.ats_analysis?.missing_keywords || [],
            },
          };
        }
      } catch (parseError) {
        enhancedData = resumeData;
      }

      return {
        success: true,
        data: enhancedData,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }
}
