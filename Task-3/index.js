// Note to the readers: The entire code logic is implemented by me (Amit Chigare). I have taken help of ChatGPT to only add meaningful comments so that any reader is able to understand the code easily. There is no use of any other platform for building this project. Thank you

const express = require("express");
const { MongoClient } = require("mongodb");
const { std } = require("mathjs"); // For standard deviation calculation

// MongoDB connection setup
const uri = "mongodb://localhost:27017";
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

// Fetch the last 100 price records for a specific cryptocurrency
const getLast100Prices = async (coin) => {
  const db = client.db("crypto_data");
  const collection = db.collection("prices");

  // Find the latest 100 records for the given cryptocurrency, sorted by timestamp in descending order
  const records = await collection
    .find({ currency: coin })
    .sort({ timestamp: -1 })
    .limit(100)
    .toArray();

  // Extract the price_usd field from the records
  const prices = records.map((record) => record.price_usd);
  return prices;
};

// Function to calculate the standard deviation
const calculateStandardDeviation = (prices) => {
  return std(prices);
};

// API route to return the standard deviation of the last 100 prices for a given cryptocurrency
app.get("/deviation", async (req, res) => {
  const { coin } = req.query;

  // Validate that the coin is one of the allowed values
  if (!["bitcoin", "matic-network", "ethereum"].includes(coin)) {
    return res.status(400).json({
      error:
        "Invalid coin. Must be one of bitcoin, matic-network, or ethereum.",
    });
  }

  try {
    // Fetch the last 100 prices
    const prices = await getLast100Prices(coin);

    // Check if we have enough data
    if (prices.length === 0) {
      return res
        .status(404)
        .json({ error: "No data found for the requested coin." });
    }

    // Calculate the standard deviation
    const deviation = calculateStandardDeviation(prices);

    // Round to 2 decimal places for clarity in response
    const roundedDeviation = Math.round(deviation * 100) / 100;

    return res.json({ deviation: roundedDeviation });
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
