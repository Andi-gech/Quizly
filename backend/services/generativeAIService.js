const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const getQuizFromAI = async (pdfText) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `Create 40 question quiz with multiple-choice questions based on the provided any PDF text with out any comment and dot cut out . Provide questions, answers, and the correct answer in this Json format  [{"questionText": "What is the capital of France?",
        "answers": [
          { "text": "Paris", "isCorrect": true },
          { "text": "Berlin", "isCorrect": false },
          { "text": "Madrid", "isCorrect": false }
        ]
      },] dont return cut out data `,
    });

    const generationConfig = {
      temperature: 0.9,
      topP: 1,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: pdfText }] }],
      generationConfig,
    });
    console.log(result.response.text())
    rawJsonResponse =await result.response.text().replace(/```json|```/g, '');
 
    
    return JSON.parse(rawJsonResponse); 
  } catch (error) {
    throw new Error('Error generating quiz from AI: ' + error.message);
  }
};

module.exports = {
  getQuizFromAI,
};
