const axios = require("axios");

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "lol",
    description: "AI",
    commandCategory: "ai",
    usages: "[ask]",
    cooldowns: 2,
    dependencies: {
        "axios": "1.4.0"
    }
};

module.exports.handleEvent = function ({ api, event, client, __GLOBAL }) {
    const { threadID, messageID, body } = event;

    if (body && (body.startsWith("ai") || body.startsWith("Ai"))) {
        const args = body.slice(2).trim().split(" ");
        module.exports.run({ api, event, args, client, __GLOBAL });
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    const query = args.join(" ").trim();

    if (!query) {
        return api.sendMessage("Please provide a question.", threadID, messageID);
    }

    const processingMessage = "🔎...";
    api.sendMessage(processingMessage, threadID, async (err, info) => {
        if (err) return console.error(err);

        try {
            api.setMessageReaction("⌛", messageID, () => {}, true);

            // Call the new API endpoint
            const response = await axios.get(`https://kaiz-apis.gleeze.com/api/gpt-4o?q=${encodeURIComponent(query)}&uid=${messageID}`);

            // Extract only the "response" data from the API
            const reply = response.data.response || "Sorry, I couldn't understand that.";

            api.sendMessage(reply, threadID, messageID);
            api.setMessageReaction("✅", messageID, () => {}, true);
        } catch (error) {
            console.error("Error fetching data from API:", error);
            api.sendMessage("An error occurred while fetching data. Please try again later.", threadID, messageID);
        }
    });
};