const Service = require("../models/Service");

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isAvailable: true }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service)
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.seedServices = async (req, res) => {
  try {
    const count = await Service.countDocuments();
    if (count > 0)
      return res.json({ success: true, message: "Services already seeded" });

    const defaultServices = [
      {
        title: "Screen Repair",
        description:
          "Professional screen replacement for all smartphone brands. We use OEM quality parts for the best display experience.",
        price: 1499,
        duration: "1-2 hours",
        category: "screen-repair",
        icon: "📱",
      },
      {
        title: "Battery Replacement",
        description:
          "Restore your phone battery life to 100%. We replace with high-capacity genuine batteries for all major brands.",
        price: 799,
        duration: "30-60 mins",
        category: "battery",
        icon: "🔋",
      },
      {
        title: "Water Damage Repair",
        description:
          "Advanced water damage treatment with ultrasonic cleaning. Recover your device from liquid damage effectively.",
        price: 1999,
        duration: "2-4 hours",
        category: "water-damage",
        icon: "💧",
      },
      {
        title: "Software Fix & Unlock",
        description:
          "Fix software issues, remove viruses, factory reset, OS updates, and unlock carrier-locked devices.",
        price: 499,
        duration: "1-3 hours",
        category: "software",
        icon: "⚙️",
      },
      {
        title: "Data Recovery",
        description:
          "Recover lost photos, contacts, messages, and important files from damaged or corrupted devices.",
        price: 2499,
        duration: "4-8 hours",
        category: "data-recovery",
        icon: "💾",
      },
      {
        title: "Charging Port Repair",
        description:
          "Fix or replace faulty charging ports. Stop struggling with charging issues on any device.",
        price: 599,
        duration: "1-2 hours",
        category: "other",
        icon: "🔌",
      },
    ];

    await Service.insertMany(defaultServices);
    const services = await Service.find();
    res.json({ success: true, message: "Services seeded", data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
