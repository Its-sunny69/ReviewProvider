import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config({ path: "./.env" });

const app = express();
const PORT = 5000;
const BEARER_TOKEN = process.env.BEARER;

app.use(cors()); // Enable CORS
app.use(express.json());

app.get("/tweet/:id", async (req, res) => {
  const tweetId = req.params.id;

  try {
    const response = await fetch(
      `https://api.twitter.com/2/tweets/${tweetId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("Error fetching tweet:", error);
    res.status(500).json({ error: "Failed to fetch tweet" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
