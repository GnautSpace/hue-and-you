export const geminiBionic = async (text) => {
  try {
    const API_KEY = import.meta.env.VITE_GEMINI_BIONIC_API_KEY;
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: "Convert the following text into Bionic Reading format. Bold the first few letters of each word for easier readability. Remove the markdown tags for example like (*,~):"
            }
          ],
        },
        contents: [{
          parts: [
            {
              text: text,
            }
          ],
        }],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return result.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error('Error in Gemini Bionic API:', error);
    throw error;
  }
};

export const geminiSummarize = async (text) => {
  try {
    const API_KEY = import.meta.env.VITE_GEMINI_SUMMARIZE_API_KEY;
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: "Summarize the following text concisely. Remove the markdown tags for example like (*,~):"
            }
          ],
        },
        contents: [{
          parts: [
            {
              text: text,
            }
          ],
        }],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

   
    return result.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error('Error in Gemini Summarize API:', error);
    throw error;
  }
};
