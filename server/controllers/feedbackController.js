const Feedback = require("../models/Feedback");

exports.submitFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res
      .status(201)
      .json({
        success: true,
        message: "Thank you for your feedback!",
        data: feedback,
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(20);
    const avgRating =
      feedbacks.length > 0
        ? (
            feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
          ).toFixed(1)
        : 0;
    res.json({
      success: true,
      data: feedbacks,
      avgRating,
      total: feedbacks.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: get all feedback (approved + unapproved)
exports.getAllFeedbacks = async (req, res) => {
  try {
    const { approved, search } = req.query;
    const query = {};
    if (approved === "true") query.isApproved = true;
    if (approved === "false") query.isApproved = false;
    if (search)
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
        { service: { $regex: search, $options: "i" } },
      ];
    const feedbacks = await Feedback.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: feedbacks, total: feedbacks.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!feedback)
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback)
      return res
        .status(404)
        .json({ success: false, message: "Feedback not found" });
    res.json({ success: true, message: "Feedback deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.seedFeedback = async (req, res) => {
  try {
    await Feedback.deleteMany({});
    const samples = [
      {
        name: "Priya Sharma",
        email: "priya@example.com",
        rating: 5,
        service: "Screen Repair",
        message:
          "Amazing service! My phone screen was repaired in under an hour. The quality is excellent and price was very reasonable.",
        isApproved: true,
      },
      {
        name: "Rohit Verma",
        email: "rohit@example.com",
        rating: 5,
        service: "Battery Replacement",
        message:
          "Battery life is back to 100% after replacement. Fast service and very professional staff.",
        isApproved: true,
      },
      {
        name: "Anita Singh",
        email: "anita@example.com",
        rating: 4,
        service: "Water Damage Repair",
        message:
          "Dropped my phone in water and thought it was done. These guys saved it! Great service.",
        isApproved: true,
      },
    ];
    await Feedback.insertMany(samples);
    res.json({
      success: true,
      message: "Feedback seeded",
      data: await Feedback.find(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
