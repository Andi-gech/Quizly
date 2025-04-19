const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generateContent(prompt, content, mimeType) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const parts = [];

  if (mimeType) {
    parts.push({
      inlineData: {
        data: Buffer.from(content).toString("base64"),
        mimeType: mimeType
      }
    });
  } else {
    parts.push({ text: content });
  }

  parts.push({ text: prompt });

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain"
    }
  });
console.log(result.response.text());
  return result.response.text();
}

const processAIResponse = (rawResponse) => {
  const cleanedJson = rawResponse
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .replace(/^JSON\s*:/i, '')
    .trim();

  return JSON.parse(cleanedJson);
};

exports.getQuizFromAI = async (content, mimeType, questionCount = 20, focusArea = 'general content') => {
  const prompt = `Generate ${questionCount} multiple-choice questions in JSON format focused on: ${focusArea}.
    Include a clear explanation for each question. Follow this format:
    [
      {
        "questionText": "Question?",
        "explanation": "Detailed explanation...",
        "answers": [
          {"text": "Option 1", "isCorrect": true},
          {"text": "Option 2", "isCorrect": false},
          {"text": "Option 3", "isCorrect": false},
          {"text": "Option 4", "isCorrect": false}
        ]
      }
    ]`;
  
  const rawResponse = await generateContent(prompt, content, mimeType);
  return processAIResponse(rawResponse);
};

exports.getFlashcardsFromAI = async (content, mimeType, cardCount = 20, focusArea = 'general content') => {
  const prompt = `Generate ${cardCount} study flashcards in JSON format focused on: ${focusArea}.
    Follow this format:
    [
      {
        "front": "Term/Question",
        "back": "Definition/Answer",
        "explanation": "Additional context..."
      }
    ]`;
  
  const rawResponse = await generateContent(prompt, content, mimeType);
  return processAIResponse(rawResponse);
};