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
