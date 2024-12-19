const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "flux",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Hung sai",
  description: "Generates an image based on a prompt using Flux API.",
  commandCategory: "image",
  usages: "[prompt]",
  cooldowns: 10,
};

module.exports.run = async function ({ api, event, args }) {
  const prompt = args.join(" ");
  if (!prompt) return api.sendMessage("Please provide a prompt.", event.threadID, event.messageID);

  try {
    // Fetch the image from Flux API
    const response = await axios.get(`https://kaiz-apis.gleeze.com/api/flux?prompt=${encodeURIComponent(prompt)}`, {
      responseType: "arraybuffer",
    });

    // Save the image to a temporary file
    const fileName = path.join(__dirname, "cache", `flux-${Date.now()}.jpg`);
    fs.writeFileSync(fileName, Buffer.from(response.data));

    // Send the image and delete the file after sending
    api.sendMessage(
      { attachment: fs.createReadStream(fileName) },
      event.threadID,
      () => {
        fs.unlinkSync(fileName); // Cleanup temporary file
      },
      event.messageID
    );
  } catch (error) {
    console.error("Error generating image:", error);
    api.sendMessage("An error occurred while generating the image. Please try again later.", event.threadID, event.messageID);
  }
};