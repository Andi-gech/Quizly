const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const getQuizFromAI = async (content, mimeType, questionCount = 20, focusArea = 'general content') => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const generationConfig = {
      temperature: 0.7,
      topP: 1,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };

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

    parts.push({ 
      text: `Generate ${questionCount} multiple-choice questions in JSON format focused on: ${focusArea}.
             Strictly follow this format (4 answers per question):
             [
               {
                 "questionText": "Question?",
                 "answers": [
                   {"text": "Option 1", "isCorrect": true},
                   {"text": "Option 2", "isCorrect": false},
                   {"text": "Option 3", "isCorrect": false},
                   {"text": "Option 4", "isCorrect": false}
                 ]
               }
             ]
             Requirements:
             1. JSON must be complete and valid
             2. Only include the JSON array
             3. Properly escape special characters
             4. No truncation - generate exactly ${questionCount} questions
             5. One correct answer per question
             Return only the JSON array with no additional text.`
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
    });

    const rawResponse = await result.response.text();
    console.log('Raw AI Response:', rawResponse);

    // Improved cleaning process
    const cleanedJson = rawResponse
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/^JSON\s*:/i, '')
      .trim();

    try {
      const parsed = JSON.parse(cleanedJson);
      
      // Validate response structure
      if (!Array.isArray(parsed)) {
        throw new Error('Response is not a JSON array');
      }
      
      for (const question of parsed) {
        if (!question.questionText || !Array.isArray(question.answers)) {
          throw new Error('Invalid question structure');
        }
      }
      
      return parsed;
    } catch (parseError) {
      console.error('JSON Parsing Error:', parseError);
      console.error('Cleaned JSON Content:', cleanedJson);
      throw new Error('Failed to parse AI response. The response might be incomplete or improperly formatted.');
    }
  } catch (error) {
    throw new Error(`AI quiz generation failed: ${error.message}`);
  }
};

module.exports = { getQuizFromAI };