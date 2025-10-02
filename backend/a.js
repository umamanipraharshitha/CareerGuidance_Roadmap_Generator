import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAKXqCTHhIZdA8Tr3SWepBYtgtGbWHdxSs");

async function main() {
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models", {
      headers: {
        "Authorization": `Bearer YOUR_API_KEY_HERE`
      }
    });
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

main();
