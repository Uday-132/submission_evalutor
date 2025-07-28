// 🎭 Creative Error Messages for Submission Evaluator
// Making errors fun, helpful, and engaging!

const errorMessages = {
  // 🤖 AI/API Related Errors
  groqApiError: {
    title: "🤖 AI Brain Freeze!",
    message: "Our AI evaluator is having a coffee break ☕. Don't worry, we've got backup systems!",
    suggestions: [
      "🔄 Try again in a few seconds - AI just needs to reboot",
      "🧠 Our backup evaluation system is analyzing your submission",
      "💡 Sometimes AI needs a moment to think deeply about your brilliant ideas"
    ],
    emoji: "🤖",
    tone: "friendly"
  },

  invalidApiKey: {
    title: "🔑 Missing AI Powers!",
    message: "Looks like our AI credentials went on vacation. Time to call them back!",
    suggestions: [
      "🛠️ Admin needs to configure the GROQ_API_KEY",
      "🔧 Check your environment variables",
      "📞 Contact support if this persists"
    ],
    emoji: "🔑",
    tone: "technical"
  },

  // 📄 File Processing Errors
  invalidFileType: {
    title: "📄 Wrong File Adventure!",
    message: "Whoa there! That file isn't quite what our AI evaluator was expecting.",
    suggestions: [
      "📊 Upload a business presentation (PDF or PowerPoint)",
      "🎯 Make sure it's a pitch deck, not a novel!",
      "💼 We love startup proposals, MSME applications, and hackathon submissions"
    ],
    emoji: "📄",
    tone: "playful"
  },

  fileTooBig: {
    title: "🐘 Massive File Alert!",
    message: "Your file is so impressive, it's too big for our system to handle! Let's make it more manageable.",
    suggestions: [
      "📏 Keep files under 50MB for best results",
      "🗜️ Try compressing your PDF or PowerPoint",
      "✂️ Remove some high-resolution images if possible"
    ],
    emoji: "🐘",
    tone: "encouraging"
  },

  extractionFailed: {
    title: "🔍 Text Detective Failed!",
    message: "Our text extraction ninja couldn't find readable content in your file. Let's troubleshoot!",
    suggestions: [
      "📝 Make sure your PDF has selectable text (not just images)",
      "🖼️ If it's all images, try a different PDF export",
      "💡 PowerPoint files usually work better for text extraction"
    ],
    emoji: "🔍",
    tone: "helpful"
  },

  // 🗄️ Database Errors
  databaseError: {
    title: "🗄️ Database Having a Moment!",
    message: "Our data storage is doing some yoga stretches. Your evaluation is safe, just give us a sec!",
    suggestions: [
      "🔄 Try refreshing the page",
      "⏰ Wait a moment and try again",
      "💾 Your work won't be lost - we've got backups!"
    ],
    emoji: "🗄️",
    tone: "reassuring"
  },

  sessionExpired: {
    title: "⏰ Time Travel Error!",
    message: "Your session took a little trip to the past. Let's bring you back to the present!",
    suggestions: [
      "🔄 Refresh the page to start a new session",
      "🍪 Clear your browser cookies if issues persist",
      "✨ Don't worry, this happens to time travelers all the time"
    ],
    emoji: "⏰",
    tone: "whimsical"
  },

  // 🚫 Access & Permission Errors
  accessDenied: {
    title: "🚫 Secret Agent Mode!",
    message: "That evaluation is classified! Only the original creator can access it.",
    suggestions: [
      "🔐 Make sure you're using the same browser/device",
      "👤 Each user has their own private evaluation space",
      "🆕 Create a new evaluation if you can't find yours"
    ],
    emoji: "🚫",
    tone: "security"
  },

  evaluationNotFound: {
    title: "🕵️ Missing Evaluation Mystery!",
    message: "That evaluation has gone on an adventure! Let's help you find it or create a new one.",
    suggestions: [
      "📋 Check your evaluation history",
      "🔍 Make sure the link is correct",
      "🆕 Start a fresh evaluation - sometimes that's even better!"
    ],
    emoji: "🕵️",
    tone: "mystery"
  },

  // 📊 Content Quality Errors
  contentTooShort: {
    title: "📏 Tiny Content Alert!",
    message: "Your submission is like a haiku - beautiful but brief! Our AI needs a bit more to work with.",
    suggestions: [
      "📝 Add more details about your problem and solution",
      "💡 Include market analysis, implementation plans, or team info",
      "🎯 Aim for at least 200 words for a thorough evaluation"
    ],
    emoji: "📏",
    tone: "encouraging"
  },

  notBusinessContent: {
    title: "🎭 Wrong Genre Alert!",
    message: "This looks more like a novel than a business pitch! Our AI is trained for startup magic, not literature.",
    suggestions: [
      "💼 Upload a business presentation or pitch deck",
      "🚀 Include problem statements, solutions, and market analysis",
      "🎯 Focus on startup proposals, MSME applications, or hackathon submissions"
    ],
    emoji: "🎭",
    tone: "redirective"
  },

  // 🌐 Network & Connection Errors
  networkError: {
    title: "🌐 Internet Hiccup!",
    message: "The internet gremlins are playing tricks! Your connection seems a bit wobbly.",
    suggestions: [
      "📶 Check your internet connection",
      "🔄 Try refreshing the page",
      "⏰ Wait a moment and try again"
    ],
    emoji: "🌐",
    tone: "technical"
  },

  serverOverload: {
    title: "🚀 Popularity Overload!",
    message: "We're so popular right now that our servers are doing a happy dance! Give us a moment to catch up.",
    suggestions: [
      "⏰ Try again in a few minutes",
      "🎉 This means lots of people love our evaluator!",
      "☕ Perfect time for a coffee break"
    ],
    emoji: "🚀",
    tone: "celebratory"
  },

  // 🎨 PDF Generation Errors
  pdfGenerationError: {
    title: "📄 PDF Printer Jam!",
    message: "Our PDF generator is having artistic differences with your evaluation. Let's sort this out!",
    suggestions: [
      "🔄 Try generating the PDF again",
      "💾 Your evaluation data is safe - just the PDF export hiccupped",
      "📋 You can always view the results on screen while we fix this"
    ],
    emoji: "📄",
    tone: "artistic"
  },

  // 🔧 General System Errors
  unexpectedError: {
    title: "🎪 Unexpected Plot Twist!",
    message: "Well, this is awkward! Something unexpected happened, but don't worry - we're on it!",
    suggestions: [
      "🔄 Try refreshing the page",
      "🐛 Our bug-hunting team has been notified",
      "💪 Your submission is safe - we never lose data"
    ],
    emoji: "🎪",
    tone: "apologetic"
  },

  maintenanceMode: {
    title: "🔧 Upgrade in Progress!",
    message: "We're making the evaluator even more awesome! Back in a jiffy with superpowers.",
    suggestions: [
      "⏰ Check back in a few minutes",
      "🚀 We're adding cool new features",
      "☕ Perfect time for a quick break"
    ],
    emoji: "🔧",
    tone: "upgrade"
  }
};

// 🎯 Smart Error Message Generator
function getErrorMessage(errorType, customMessage = null) {
  const errorConfig = errorMessages[errorType] || errorMessages.unexpectedError;
  
  return {
    title: errorConfig.title,
    message: customMessage || errorConfig.message,
    suggestions: errorConfig.suggestions,
    emoji: errorConfig.emoji,
    tone: errorConfig.tone,
    timestamp: new Date().toISOString(),
    errorType: errorType
  };
}

// 🎨 Error Response Formatter
function formatErrorResponse(errorType, customMessage = null, statusCode = 500) {
  const errorData = getErrorMessage(errorType, customMessage);
  
  return {
    success: false,
    error: {
      ...errorData,
      statusCode: statusCode
    }
  };
}

// 🎭 Random Encouraging Messages
const encouragingMessages = [
  "Don't worry, even Steve Jobs had technical difficulties! 🍎",
  "Every great startup faces obstacles - this is just a tiny speed bump! 🚀",
  "Plot twist: This error is just making your success story more interesting! 📖",
  "Even our AI needs coffee breaks sometimes ☕",
  "This is just the universe testing your persistence! 💪",
  "Great ideas are worth waiting for! ⭐",
  "Consider this a brief intermission in your success story! 🎭"
];

function getRandomEncouragement() {
  return encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];
}

module.exports = {
  errorMessages,
  getErrorMessage,
  formatErrorResponse,
  getRandomEncouragement
};