const OpenAI = require('openai');

exports.handler = async (event) => {
    const openaiApiKey = process.env.OPENAI_API_KEY;

    const openai = new OpenAI({
        apiKey: openaiApiKey,
    });

    try {
        // Parse the POST body
        const requestBody = JSON.parse(event.body);
        const userMessage = requestBody.message || "Hello!";

        const openaiResponse = await openai.chat.completions.create({
            model: "gpt-4o-2024-08-06",
            messages: [
                { role: "system", content: "You are a helpful assistant answering questions about cartoons or animations." },
                { role: "user", content: userMessage }
            ],
            max_tokens: 2000,
        });

        const retVal = openaiResponse.choices[0].message;

        const response = {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify({
                message: "Results from Lambda!",
                openaiResponse: retVal
            }),
        };
        return response;
    } catch (error) {
        const response = {
            statusCode: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
            },
            body: JSON.stringify({
                message: "Error invoking OpenAI API",
                error: error.message
            }),
        };
        return response;
    }
};
