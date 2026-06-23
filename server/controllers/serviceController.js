const Service = require("../models/Service");

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isAvailable: true }).sort({
      createdAt: -1,
    });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single service
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new service
exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res
      .status(201)
      .json({
        success: true,
        message: "Service created successfully",
        data: service,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Seed default services
exports.seedServices = async (req, res) => {
  try {
    const count = await Service.countDocuments();
    if (count > 0) {
      return res.status(400).json({ message: "Services already seeded" });
    }
    const defaultServices = [
      {
        title: "Screen Repair",
        description:
          "Professional screen replacementfor all smartphone brands. We use OEM quality parts to ensure your device looks and functions like new.",
        price: 100,
        duration: "1-2 hours",
        category: "screen-repair",
        icon: "📱",
      },
      {
        title: "Battery Replacement",
        description:
          "Fast and reliable battery replacement service. We use high-quality batteries to ensure your device lasts longer and performs better.",
        price: 80,
        duration: "30-60 minutes",
        category: "battery",
        icon: "🔋",
      },
      {
        title: "Software Troubleshooting",
        description:
          "Expert software troubleshooting for all smartphone brands. We can fix software issues, remove viruses, and optimize your device for better performance.",
        price: 50,
        duration: "1-2 hours",
        category: "software",
        icon: "💻",
      },
      {
        title: "Water Damage Repair",
        description:
          "Professional water damage repair service. We can clean and repair your device to restore its functionality after water exposure.",
        price: 120,
        duration: "2-3 hours",
        category: "water-damage",
        icon: "💧",
      },
      {
        title: "Data Recovery",
        description:
          "Reliable data recovery service for all smartphone brands. We can recover lost data from damaged or corrupted devices.",
        price: 150,
        duration: "2-4 hours",
        category: "data-recovery",
        icon: "💾",
      },
      {
        title: "Other Repairs",
        description:
          "We offer a wide range of other repair services for smartphones, including camera replacement, charging port repair, and more.",
        price: 70,
        duration: "1-2 hours",
        category: "other",
        icon: "🛠",
      },
    ];
    await Service.insertMany(defaultServices);
    const seededServices = await Service.find();
    res
      .status(201)
      .json({
        success: true,
        message: "Default services seeded successfully",
        data: seededServices,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
