# Cryptocurrency Price Standard Deviation API

I implemented an API `/deviation` that returns the standard deviation of the price of a requested cryptocurrency for the last 100 records stored by the background service in the MongoDB database.

## Solution Breakdown

### Projet Setup

#### 1. Install required packages

```bash
npm install express mongodb mathjs
```

#### 2. Run the Node.js application:

```bash
node index.js
```

#### 3. You can test the API by making a GET request to:

```bash
http://localhost:3000/deviation?coin=bitcoin
```

#### Example Output:

```json
{
  "deviation": 4082.48
}
```

### API Endpoint

- **URL**: `/deviation`
- **Method**: `GET`
- **Query Parameter**: `coin`
  - Can be one of `bitcoin`, `matic-network`, or `ethereum`

### MongoDB Query

The `getLast100Prices` function fetches the last 100 records for the requested cryptocurrency, sorted by timestamp in descending order. It uses the `find()` method with `sort()` and `limit()` to query MongoDB. It then extracts the `price_usd` field from each document and returns it as an array.

```javascript
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
```

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
