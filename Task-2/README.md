# Cryptocurrency Latest Data API

I implemented an API `/stats` that returns the latest data about a requested cryptocurrency from a MongoDB database. The cryptocurrency data includes the `current price` in USD, `market capitalization` in USD, and `24-hour percentage` change.

The `getLatestCryptoData` function queries the MongoDB collection (prices) to find the most recent document for the requested cryptocurrency, using the timestamp field to sort in descending order (latest first).
API Route `(/stats)`:

The route accepts a query parameter coin, which should be one of `bitcoin`, `matic-network`, or `ethereum`.
The API validates the coin and responds with the latest cryptocurrency data if found, returning a structured JSON response with `price`, `marketCap`, and `24hChange`.

Error Handling:
The API checks if the provided coin is valid, returning a `400 Bad Request` error if it’s invalid.
If no data is found for the given coin, it returns a `404 Not Found` error.
If any other errors occur (e.g., issues with MongoDB), it returns a yyy500 Internal Server Error.

## Solution Breakdown

### Project Setup

#### 1. Install required packages

```bash
npm install express mongodb

```

#### 2. Run the Node.js application:

```bash
node index.js
```

#### 3. You can test the API by making a GET request to:

```bash
http://localhost:3000/stats?coin=bitcoin
```

#### Example Output:

```json
{
  "price": 40000,
  "marketCap": 800000000,
  "24hChange": 3.4
}
```

### API Endpoint

- **URL**: `/stats`
- **Method**: `GET`
- **Query Parameter**: `coin`
  - Can be one of `bitcoin`, `matic-network`, or `ethereum`

### MongoDB Query

The `getLatestCryptoData` function fetches the most recent record for the requested cryptocurrency, sorted by timestamp in descending order. It uses the `findOne()` method with `sort()` to query MongoDB.

```javascript
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

#### 1. If the `coin` is invalid, the API returns a `400 Bad Request` error with a message:

```json
{
  "error": "Invalid coin. Must be one of bitcoin, matic-network, or ethereum."
}
```

#### 2. If no data is found for the requested cryptocurrency, the API returns a `404 Not Found` error with a message:

```json
{
  "error": "Data not found for the requested coin."
}
```

#### 3. For server-side issues (e.g., database connection problems), the API returns a `500 Internal Server Error` response with a message:

```json
{
  "error": "Internal server error."
}
```

### File Structure

- **README.md**: This file
- **index.js**: My Node.js application script.

#### Note to the readers:

The entire code logic is implemented by me (Amit Chigare). I have taken help of ChatGPT to only add meaningful comments so that any reader is able to understand the code easily. There is no use of any other platform for building this project. Thank you
