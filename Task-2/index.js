// Note to the readers: The entire code logic is implemented by me (Amit Chigare). I have taken help of ChatGPT to only add meaningful comments so that any reader is able to understand the code easily. There is no use of any other platform for building this project. Thank you

const express = require("express");
const { MongoClient } = require("mongodb");

// MongoDB connection setup
const uri = "mongodb://localhost:27017"; // Update with your MongoDB connection string
const client = new MongoClient(uri);

// Express setup
const app = express();
const port = 3000;

// Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

// Fetch the latest data for a specific cryptocurrency
const getLatestCryptoData = async (coin) => {
  const db = client.db("crypto_data");
  const collection = db.collection("prices");

  // Find the latest document for the given cryptocurrency, sorting by timestamp in descending order
  const data = await collection.findOne(
    { currency: coin },
    { sort: { timestamp: -1 } }
  );
  return data;
};

// API route to return latest data for a given cryptocurrency
app.get("/stats", async (req, res) => {
  const { coin } = req.query;

  // Validate that the coin is one of the allowed values
  if (!["bitcoin", "matic-network", "ethereum"].includes(coin)) {
    return res.status(400).json({
      error:
        "Invalid coin. Must be one of bitcoin, matic-network, or ethereum.",
    });
  }

  try {
    const data = await getLatestCryptoData(coin);

    if (!data) {
      return res
        .status(404)
        .json({ error: "Data not found for the requested coin." });
    }

    // Structure the response
    const response = {
      price: data.price_usd,
      marketCap: data.market_cap_usd,
      "24hChange": data.change_24h,
    };

    return res.json(response);
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectToMongoDB();
});
