import CryptoPrice from "../Models/crypto.models.js";

const allowedSymbols = ["BTC", "ETH", "DOGE", "EOS", "RPE"];

export const seedCrypto = async () => {
  try {
    for (const symbol of allowedSymbols) {
      // if it doesn't exist, insert it
      await CryptoPrice.findOneAndUpdate(
        { symbol },
        {
          $setOnInsert: {
            price: 0,
            change: 0,
            volume: "0",
          },
        },
        { upsert: true, new: true }
      );
    }
    console.log("✅ Cryptos seeded successfully");
  } catch (err) {
    console.error("❌ Error seeding cryptos:", err);
  }
};