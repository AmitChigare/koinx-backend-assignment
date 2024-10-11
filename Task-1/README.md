# Cryptocurrency Data Fetching Background Job

I implemented a background job that fetches the current price in USD, market capitalization in USD, and 24-hour percentage change of three cryptocurrencies (`Bitcoin, Matic, and Ethereum`) using the `CoinGecko API`. The data is then stored in a MongoDB database. This job is scheduled to run once every two hours using `node-cron`.

Connects to a MongoDB database using the `MongoClient` from the mongodb package.

Fetch Function:
Constructs the API URL to fetch data for Bitcoin, Matic, and Ethereum.
After fetching the data, it prepares the data structure to insert into MongoDB. Each entry includes the `cryptocurrency`, `price`, `market cap`, `change percentage`, and `a timestamp`.
Inserts each cryptocurrency data into the prices collection in the `crypto_data database`.

Scheduler:
Uses node-cron to schedule the `fetchCryptoData` function to run every `2 hours`.
Calls `fetchCryptoData` initially to ensure data is fetched immediately upon starting the application.

## Solution Breakdown

### Project Setup

#### 1. Install required packages

```bash
npm install axios node-cron mongodb
```

#### 2. Run the Node.js application:

```bash
node index.js
```

#### 3. The job fetches cryptocurrency data every two hours and stores it in MongoDB.

### Background Job Logic

#### 1. Fetch cryptocurrency data from the CoinGecko API

We use the `/simple/price` endpoint from the CoinGecko API to get the price, market cap, and 24-hour percentage change for Bitcoin, Matic, and Ethereum.

#### 2. Store the data in MongoDB

The fetched data is inserted into the MongoDB `prices` collection with fields for currency, price, market cap, percentage change, and timestamp.

### Database Schema

```json
{
    "_id": ObjectId("..."),
    "currency": "bitcoin",
    "price_usd": 40000,
    "market_cap_usd": 800000000,
    "change_24h": 3.4,
    "timestamp": ISODate("2024-10-11T08:00:00Z")
}
```

### File Structure

- **README.md**: This file
- **index.js**: My Node.js application script.

#### Note to the readers:

The entire code logic is implemented by me (Amit Chigare). I have taken help of ChatGPT to only add meaningful comments so that any reader is able to understand the code easily. There is no use of any other platform for building this project. Thank you
