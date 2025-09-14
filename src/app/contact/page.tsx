import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Get in touch with our team for support or feedback
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we&apos;ll get back to you as soon
                as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-1"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground resize-none"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Common questions about our ATS Resume Checker
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">
                  How does the ATS analysis work?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes your resume for ATS compatibility by checking
                  formatting, keyword optimization, and structure. We provide a
                  detailed score and specific recommendations for improvement.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  Is my resume data secure?
                </h4>
                <p className="text-sm text-muted-foreground">
                  Yes, your resume data is processed securely and never stored
                  on our servers. We use industry-standard encryption and
                  privacy practices.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  What file formats are supported?
                </h4>
                <p className="text-sm text-muted-foreground">
                  We support PDF, DOC, and DOCX formats. For best results, we
                  recommend using PDF format as it maintains formatting
                  consistency.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
