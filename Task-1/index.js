// Note to the readers: The entire code logic is implemented by me (Amit Chigare). I have taken help of ChatGPT to only add meaningful comments so that any reader is able to understand the code easily. There is no use of any other platform for building this project. Thank you

const axios = require("axios");
const cron = require("node-cron");
const { MongoClient } = require("mongodb");

// MongoDB connection setup
const uri = "mongodb://localhost:27017/"; // Update with your MongoDB connection string
const client = new MongoClient(uri);

const fetchCryptoData = async () => {
  const coins = ["bitcoin", "matic-network", "ethereum"];
  const url =
    "https://api.coingecko.com/api/v3/simple/price?ids=" +
    coins.join(",") +
    "&vs_currencies=usd&include_market_cap=true&include_24hr_change=true";

  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(data);

    const db = client.db("crypto_data");
    const collection = db.collection("prices");

    // Insert data into the MongoDB collection
    for (const coin of coins) {
      const priceData = {
        currency: coin,
        price_usd: data[coin].usd,
        market_cap_usd: data[coin].usd_market_cap,
        change_24h: data[coin].usd_24h_change,
        timestamp: new Date(), // Current timestamp
      };

      await collection.insertOne(priceData);
    }

    console.log("Data fetched and stored successfully.");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// Connect to MongoDB and start the scheduled job
const run = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB.");

    // Schedule the job to run every 2 hours
    cron.schedule("0 */2 * * *", fetchCryptoData);

    // Initial fetch
    await fetchCryptoData();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

// Start the process
run();
