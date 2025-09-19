import { NextRequest, NextResponse } from "next/server";
import { GeminiService } from "@/lib/gemini-service";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // Reduced to 5MB for faster processing
const REQUEST_TIMEOUT = 45000; // 45 seconds timeout

export async function POST(request: NextRequest) {
  try {
    // Set timeout for the entire request
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout - processing took too long')), REQUEST_TIMEOUT);
    });

    const processPromise = async (): Promise<NextResponse> => {
      const formData = await request.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
      }

      // Validate file type
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { error: "Invalid file type. Please upload a PDF, DOC, or DOCX file." },
          { status: 400 }
        );
      }

      // Validate file size (reduced to 5MB for faster processing)
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error: "File size too large. Please upload a file smaller than 5MB for faster processing.",
          },
          { status: 400 }
        );
      }

      // Convert file to base64 with optimization
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Data = buffer.toString("base64");

      // Process with Gemini AI using optimized service
      const geminiService = new GeminiService();
      const result = await geminiService.processResumeWithGemini(
        base64Data,
        file.type,
        file.name
      );

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Failed to process resume" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: result.data,
        message: "Resume processed successfully",
      });
    };

    // Race between processing and timeout
    try {
      const result = await Promise.race([processPromise(), timeoutPromise]);
      return result;
    } catch (timeoutError) {
      if (timeoutError instanceof Error && timeoutError.message.includes('timeout')) {
        return NextResponse.json(
          { error: "Processing timeout. Please try with a smaller file or try again later." },
          { status: 408 }
        );
      }
      throw timeoutError;
    }

  } catch (error) {
    console.error("Error processing resume:", error);
    
    if (error instanceof Error && error.message.includes('timeout')) {
      return NextResponse.json(
        { error: "Processing timeout. Please try with a smaller file or try again later." },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
