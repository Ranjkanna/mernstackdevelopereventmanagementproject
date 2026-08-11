// Requires ANTHROPIC_API_KEY set in your backend's .env file (never in frontend code).
// Get a key at console.anthropic.com → Settings → API Keys.

const chatController = {
  // POST /api/chat
  // Body: { messages: [{ from: "user"|"bot", text: "..." }, ...] }
  // Frontend sends its whole visible message history; this reshapes it for
  // Anthropic's API and keeps the API key out of the browser entirely.
  sendMessage: async (req, res) => {
    try {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ message: "Server is missing ANTHROPIC_API_KEY — add it to your .env file." });
      }
      // TEMP DEBUG — remove once the key issue is fixed. Never logs the full key.
      console.log("DEBUG key length:", apiKey.length, "| starts:", JSON.stringify(apiKey.slice(0,10)), "| ends:", JSON.stringify(apiKey.slice(-5)));

      const { messages } = req.body;
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ message: "messages array is required." });
      }

      // Drop the initial greeting bubble (index 0, always from the bot) and
      // reshape { from, text } → Anthropic's { role, content } format.
      const apiMessages = messages
        .filter((m, i) => !(i === 0 && m.from === "bot"))
        .map(m => ({
          role: m.from === "user" ? "user" : "assistant",
          content: m.text,
        }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          // Pick a currently available model — check console.anthropic.com/docs
          // for the latest list; Haiku is a good cost/speed fit for a chat widget.
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          system: "You are TARA, a friendly AI assistant for 'Event Planner' — a premium event planning service in Chennai, India. Help users with event planning questions, pricing estimates, venue suggestions, and guide them to book events. Keep responses concise, warm, and helpful. Always encourage users to sign up and book via the website.",
          messages: apiMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Anthropic API error:", data);
        return res.status(response.status).json({ message: data.error?.message || "Anthropic API request failed." });
      }

      const reply = data.content?.[0]?.text || "Sorry, I couldn't process that. Please try again!";
      res.status(200).json({ reply });
    } catch (err) {
      console.error("Chat proxy error:", err);
      res.status(500).json({ message: "Error contacting AI service: " + err.message });
    }
  },
};

module.exports = chatController;