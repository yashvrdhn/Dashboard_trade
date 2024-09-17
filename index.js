const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = 5000;

app.use(cors());

const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.error("MongoDB connection error:", err));

const cryptoSchema = new mongoose.Schema({
  name: String,
  last: String,
  buy: String,
  sell: String,
  volume: String,
  base_unit: String,
});

const Crypto = mongoose.model("Crypto", cryptoSchema);

app.get("/fetch-crypto", async (req, res) => {
  try {
    const response = await axios.get("https://api.wazirx.com/api/v2/tickers");
    const tickers = Object.values(response.data).slice(0, 10);

    console.log("Fetched tickers:", tickers);

    await Crypto.deleteMany({});
    console.log("Cleared existing collection");

    for (let ticker of tickers) {
      const newCrypto = new Crypto({
        name: ticker.name,
        last: ticker.last,
        buy: ticker.buy,
        sell: ticker.sell,
        volume: ticker.volume,
        base_unit: ticker.base_unit,
      });

      try {
        await newCrypto.save();
        console.log("Saved newCrypto:", newCrypto);
      } catch (saveError) {
        console.error("Error saving data:", saveError);
      }
    }

    res.send("Data fetched and stored in the database!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching or storing data.");
  }
});

app.get("/get-crypto", async (req, res) => {
  try {
    const cryptos = await Crypto.find();
    res.json(cryptos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from database.");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
