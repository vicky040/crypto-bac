// controllers/settingsController.js
import Settings from "../Models/settings.model.js";

// Get current Telegram link
export const getTelegramLink = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.status(200).json({ telegramLink: settings?.telegramLink || "" });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Telegram link" });
  }
};

// Update or create Telegram link
export const updateTelegramLink = async (req, res) => {
  try {
    const { telegramLink } = req.body;

    console.log(telegramLink);
    
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings({ telegramLink });
    else settings.telegramLink = telegramLink;

    await settings.save();
    res.status(200).json({ message: "Telegram link updated successfully", telegramLink });
  } catch (error) {
    res.status(500).json({ message: "Failed to update Telegram link" });
  }
};
