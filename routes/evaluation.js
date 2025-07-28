const express = require('express');
const Groq = require('groq-sdk');
const Evaluation = require('../models/Evaluation');
const PDFDocument = require('pdfkit');
const fs = require('fs-extra');
const path = require('path');

const router = express.Router();

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Fallback evaluation function when AI response is not valid JSON
function createFallbackEvaluation(extractedText) {
  console.log('Creating fallback evaluation due to AI response issues');
  
  // Basic analysis of the text
  const wordCount = extractedText.split(/\s+/).length;
  const hasBusinessTerms = /\b(business|startup|solution|problem|market|customer|revenue|product|service|innovation|technology)\b/i.test(extractedText);
  const hasPresentationStructure = /\b(slide|presentation|agenda|overview|conclusion|summary)\b/i.test(extractedText);
  
  // Determine basic scores based on content analysis
  const baseScore = hasBusinessTerms && hasPresentationStructure ? 6 : 4;
  const lengthBonus = wordCount > 200 ? 1 : 0;
  
  const scores = {
    clarity: Math.min(10, baseScore + lengthBonus),
    innovation: Math.min(10, baseScore),
    feasibility: Math.min(10, baseScore),
    presentation: Math.min(10, baseScore + (hasPresentationStructure ? 1 : 0)),
    impact: Math.min(10, baseScore),
    theme_alignment: Math.min(10, baseScore)
  };
  
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const grade = totalScore >= 50 ? 'A' : totalScore >= 40 ? 'B' : 'C';
  
  // Extract basic keywords
  const commonBusinessWords = extractedText.toLowerCase().match(/\b(innovation|technology|solution|business|market|customer|product|service|startup|digital|platform|system|application|development|strategy|growth|revenue|impact|sustainable|efficient|scalable)\b/g) || [];
  const uniqueKeywords = [...new Set(commonBusinessWords)].slice(0, 5);
  
  return {
    scores,
    total_score: totalScore,
    grade,
    feedback_summary: "This submission has been evaluated using our fallback analysis system. The content shows potential but may benefit from clearer structure and more detailed presentation of the business concept.",
    theme: hasBusinessTerms ? "Business/Technology" : "General",
    keywords: uniqueKeywords.length > 0 ? uniqueKeywords : ["business", "solution", "innovation"],
    project_title: "Business Solution Proposal",
    project_summary: "A business-focused submission that presents ideas and concepts for evaluation. The content demonstrates effort in addressing key business challenges.",
    improvement_suggestions: [
      "Enhance the clarity and structure of your presentation",
      "Provide more specific details about implementation and feasibility",
      "Include stronger market analysis and competitive positioning"
    ],
    recommended_resources: [
      "Business Model Canvas for strategic planning",
      "Pitch Deck Templates for better presentation structure"
    ],
    visual_quality_comment: "Content structure could be improved for better readability and professional presentation",
    pitch_readiness_score: Math.min(10, baseScore)
  };
}

// Enhanced evaluation with advanced features using Groq API
async function evaluateSubmission(extractedText) {
  // First, check if the content appears to be a presentation/pitch deck
  const presentationCheckPrompt = `Analyze the following text and determine if it appears to be from a presentation, pitch deck, or proposal document. Look for indicators like:
- Slide-like structure with titles and bullet points
- Business/startup terminology (problem, solution, market, etc.)
- Presentation flow (introduction, problem statement, solution, etc.)
- Concise, presentation-style language

Text to analyze:
"""${extractedText.substring(0, 2000)}"""

Respond with only "YES" if it appears to be a presentation/pitch deck, or "NO" if it appears to be a regular document, research paper, or other non-presentation content.`;

  try {
    const checkResponse = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: presentationCheckPrompt }],
      temperature: 0.1,
      max_tokens: 10
    });

    const isPresentation = checkResponse.choices[0].message.content.trim().toUpperCase();
    
    if (isPresentation === "NO") {
      throw new Error("INVALID_CONTENT_TYPE: ⚠️ This document doesn't appear to be a presentation or pitch deck. Please upload a proper business presentation with:\n• Slide-based structure\n• Problem and solution statements\n• Business/startup content\n• Project proposals or pitch materials\n\nAccepted formats: Business presentations, pitch decks, startup proposals, MSME applications, hackathon submissions.");
    }
  } catch (error) {
    if (error.message.includes("INVALID_CONTENT_TYPE")) {
      throw error;
    }
    // If the check fails, continue with evaluation (don't block on this check)
    console.warn("Presentation check failed, continuing with evaluation:", error.message);
  }

  const prompt = `IMPORTANT: You must respond with ONLY valid JSON. Do not include any explanatory text, markdown formatting, or additional commentary.

You are an expert AI evaluator for pitch decks, MSME proposals, and hackathon submissions. Analyze the content and return ONLY the JSON evaluation below.

Evaluation Criteria (score 1-10 each):
- Clarity: Is the idea clearly explained?
- Innovation: How novel is the solution?
- Feasibility: Is it technically implementable?
- Presentation: Is content professional and structured?
- Impact: Expected market/social impact?
- Theme Alignment: Fits competition goals?

Content to evaluate:
"""${extractedText.substring(0, 3000)}"""

Return ONLY this JSON structure with actual values:
{
    "scores": {
        "clarity": 7,
        "innovation": 8,
        "feasibility": 6,
        "presentation": 7,
        "impact": 8,
        "theme_alignment": 7
    },
    "total_score": 43,
    "grade": "B",
    "feedback_summary": "This submission demonstrates strong innovation and potential impact. The core concept is well-articulated with clear problem identification. However, the feasibility analysis could be strengthened with more technical details and implementation roadmap.",
    "theme": "Technology",
    "keywords": ["innovation", "technology", "solution", "market", "implementation"],
    "project_title": "Innovative Tech Solution for Market Challenge",
    "project_summary": "A technology-driven approach to solving key market challenges through innovative implementation. The solution addresses specific user needs with scalable and practical methodology.",
    "improvement_suggestions": [
        "Provide more detailed technical implementation plan",
        "Include market validation data and user research",
        "Strengthen financial projections and business model"
    ],
    "recommended_resources": [
        "Lean Startup Methodology for validation",
        "Business Model Canvas for strategy"
    ],
    "visual_quality_comment": "Content appears well-structured with clear sections and logical flow",
    "pitch_readiness_score": 7
}`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1500
    });

    let resultText = response.choices[0].message.content.trim();

    // Debug log to see what we're getting from Groq
    console.log('Raw Groq response:', resultText.substring(0, 200) + '...');

    // Enhanced JSON extraction with multiple fallback methods
    let jsonText = resultText;

    // Method 1: Extract from ```json blocks
    if (resultText.includes("```json")) {
      jsonText = resultText.split("```json")[1].split("```")[0].trim();
    }
    // Method 2: Extract from ``` blocks
    else if (resultText.includes("```")) {
      jsonText = resultText.split("```")[1].trim();
    }
    // Method 3: Look for JSON-like structure
    else if (resultText.includes("{") && resultText.includes("}")) {
      const start = resultText.indexOf("{");
      const end = resultText.lastIndexOf("}") + 1;
      jsonText = resultText.substring(start, end);
    }
    // Method 4: If no JSON structure found, create fallback response
    else {
      console.warn('No JSON structure found in response, using fallback');
      return createFallbackEvaluation(extractedText);
    }

    // Clean up common issues
    jsonText = jsonText.trim();
    
    // Remove any leading/trailing text that might interfere
    jsonText = jsonText.replace(/^[^{]*/, '').replace(/[^}]*$/, '');

    if (jsonText && jsonText.startsWith('{') && jsonText.endsWith('}')) {
      try {
        const parsedResult = JSON.parse(jsonText);

        // Validate and provide defaults for missing fields
        const defaultResult = {
          scores: {
            clarity: parsedResult.scores?.clarity || 5,
            innovation: parsedResult.scores?.innovation || 5,
            feasibility: parsedResult.scores?.feasibility || 5,
            presentation: parsedResult.scores?.presentation || 5,
            impact: parsedResult.scores?.impact || 5,
            theme_alignment: parsedResult.scores?.theme_alignment || 5
          },
          total_score: parsedResult.total_score || 30,
          grade: parsedResult.grade || "B",
          feedback_summary: parsedResult.feedback_summary || "Evaluation completed successfully.",
          theme: parsedResult.theme || "General",
          keywords: parsedResult.keywords || ["innovation", "technology", "solution"],
          project_title: parsedResult.project_title || "Innovative Solution",
          project_summary: parsedResult.project_summary || "A comprehensive solution addressing key challenges.",
          improvement_suggestions: parsedResult.improvement_suggestions || [
            "Enhance clarity in presentation",
            "Provide more detailed implementation plan",
            "Include market analysis and validation"
          ],
          recommended_resources: parsedResult.recommended_resources || [
            "Business Model Canvas",
            "Lean Startup Methodology"
          ],
          visual_quality_comment: parsedResult.visual_quality_comment || "Content appears well-structured.",
          pitch_readiness_score: parsedResult.pitch_readiness_score || 6
        };

        return defaultResult;

      } catch (jsonError) {
        console.error('JSON parsing failed:', jsonError);
        console.log('Failed JSON text:', jsonText.substring(0, 500));
        console.warn('Using fallback evaluation due to JSON parsing error');
        return createFallbackEvaluation(extractedText);
      }
    } else {
      console.warn('Invalid JSON structure, using fallback evaluation');
      return createFallbackEvaluation(extractedText);
    }

  } catch (error) {
    console.error('Groq API error:', error);
    console.warn('API call failed, using fallback evaluation');
    return createFallbackEvaluation(extractedText);
  }
}

// Generate PDF report
function generatePDFReport(evaluationData, filename) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Title
      doc.fontSize(18).text('📝 Advanced Submission Evaluation Report', { align: 'center' });
      doc.moveDown(2);

      // File info and basic metrics
      doc.fontSize(12)
         .text(`File: ${filename}`)
         .text(`Theme/Domain: ${evaluationData.theme}`)
         .text(`Pitch Readiness Score: ${evaluationData.pitchReadinessScore}/10`)
         .moveDown();

      // Project insights
      doc.fontSize(14).text('💡 Project Insights', { underline: true });
      doc.fontSize(12)
         .text(`Suggested Title: ${evaluationData.projectTitle}`)
         .moveDown(0.5)
         .text('Project Summary:')
         .text(evaluationData.projectSummary)
         .moveDown(0.5);

      // Keywords
      if (evaluationData.keywords && evaluationData.keywords.length > 0) {
        doc.text(`Key Concepts: ${evaluationData.keywords.join(', ')}`);
      }
      doc.moveDown();

      // Scores
      doc.fontSize(14).text('📊 Detailed Evaluation Scores', { underline: true });
      doc.fontSize(12);
      
      const scores = evaluationData.scores;
      doc.text(`Clarity: ${scores.clarity}/10`)
         .text(`Innovation: ${scores.innovation}/10`)
         .text(`Feasibility: ${scores.feasibility}/10`)
         .text(`Presentation Quality: ${scores.presentation}/10`)
         .text(`Impact: ${scores.impact}/10`)
         .text(`Theme Alignment: ${scores.theme_alignment}/10`)
         .moveDown(0.5)
         .text(`Total Score: ${evaluationData.totalScore}/60`)
         .text(`Grade: ${evaluationData.grade}`)
         .moveDown();

      // Visual quality
      doc.fontSize(14).text('🎨 Visual Quality Assessment', { underline: true });
      doc.fontSize(12).text(evaluationData.visualQualityComment).moveDown();

      // Feedback
      doc.fontSize(14).text('💬 Professional Feedback', { underline: true });
      doc.fontSize(12).text(evaluationData.feedbackSummary).moveDown();

      // Improvements
      doc.fontSize(14).text('🛠 Improvement Suggestions', { underline: true });
      doc.fontSize(12);
      evaluationData.improvementSuggestions.forEach((suggestion, index) => {
        doc.text(`${index + 1}. ${suggestion}`);
      });
      doc.moveDown();

      // Resources
      doc.fontSize(14).text('📚 Recommended Resources', { underline: true });
      doc.fontSize(12);
      evaluationData.recommendedResources.forEach((resource, index) => {
        doc.text(`${index + 1}. ${resource}`);
      });

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
}

// Evaluate submission endpoint
router.post('/evaluate', async (req, res) => {
  try {
    const { extractedText, filename, originalName, extractionStats } = req.body;

    if (!extractedText || !filename) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get evaluation from Groq AI
    const evaluationResult = await evaluateSubmission(extractedText);

    // Save evaluation to database with session-based privacy
    const evaluation = new Evaluation({
      filename: filename,
      originalName: originalName,
      extractedText: extractedText,
      extractionStats: extractionStats,
      scores: evaluationResult.scores,
      totalScore: evaluationResult.total_score,
      grade: evaluationResult.grade,
      feedbackSummary: evaluationResult.feedback_summary,
      theme: evaluationResult.theme,
      keywords: evaluationResult.keywords,
      projectTitle: evaluationResult.project_title,
      projectSummary: evaluationResult.project_summary,
      improvementSuggestions: evaluationResult.improvement_suggestions,
      recommendedResources: evaluationResult.recommended_resources,
      visualQualityComment: evaluationResult.visual_quality_comment,
      pitchReadinessScore: evaluationResult.pitch_readiness_score,
      sessionId: req.session.userId // Add session ID for privacy
    });

    const savedEvaluation = await evaluation.save();

    res.json({
      success: true,
      evaluation: savedEvaluation
    });

  } catch (error) {
    console.error('Evaluation error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to evaluate submission' 
    });
  }
});

// Generate PDF report endpoint (session-based privacy)
router.post('/generate-report', async (req, res) => {
  try {
    const { evaluationId } = req.body;

    if (!evaluationId) {
      return res.status(400).json({ error: 'Evaluation ID is required' });
    }

    // Only allow PDF generation for evaluations belonging to current user's session
    const evaluation = await Evaluation.findOne({ 
      _id: evaluationId, 
      sessionId: req.session.userId 
    });
    
    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found or access denied' });
    }

    const pdfBuffer = await generatePDFReport(evaluation, evaluation.originalName);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="evaluation_report_${evaluation.originalName.split('.')[0]}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate PDF report' 
    });
  }
});

// Get all evaluations (session-based privacy)
router.get('/history', async (req, res) => {
  try {
    // Only fetch evaluations for the current user's session
    const evaluations = await Evaluation.find({ sessionId: req.session.userId })
      .select('-extractedText') // Exclude large text field
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      evaluations: evaluations,
      sessionId: req.session.userId.substring(0, 8) + '...' // For debugging
    });

  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch evaluation history' 
    });
  }
});

// Get specific evaluation (session-based privacy)
router.get('/:id', async (req, res) => {
  try {
    // Only fetch evaluation if it belongs to the current user's session
    const evaluation = await Evaluation.findOne({ 
      _id: req.params.id, 
      sessionId: req.session.userId 
    });
    
    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found or access denied' });
    }

    res.json({
      success: true,
      evaluation: evaluation
    });

  } catch (error) {
    console.error('Evaluation fetch error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch evaluation' 
    });
  }
});

module.exports = router;