const Appointment = require("../models/Appointment");
const Service = require("../models/Service");

exports.bookAppointment = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      serviceId,
      deviceModel,
      issueDescription,
      appointmentDate,
      appointmentTime,
    } = req.body;
    // Check if slot is already booked
    const existingAppointment = await Appointment.findOne({
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $nin: ["cancelled"] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message:
          "This time slot is already booked. Please choose another time.",
      });
    }
    const appointment = await Appointment.create({
      name,
      email,
      phone,
      service: serviceId,
      deviceModel,
      issueDescription,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
    });
    const populated = await appointment.populate(
      "service",
      "title price duration",
    );
    res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      data: populated,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== "all") query.status = status;
    if (search)
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { deviceModel: { $regex: search, $options: "i" } },
      ];
    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .populate("service", "title price category icon")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({
      success: true,
      data: appointments,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ email: req.params.email })
      .populate("service", "title price duration icon")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    ).populate("service", "title price");
    if (!appointment)
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment)
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    res.json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [total, pending, confirmed, inProgress, completed, cancelled] =
      await Promise.all([
        Appointment.countDocuments(),
        Appointment.countDocuments({ status: "pending" }),
        Appointment.countDocuments({ status: "confirmed" }),
        Appointment.countDocuments({ status: "in-progress" }),
        Appointment.countDocuments({ status: "completed" }),
        Appointment.countDocuments({ status: "cancelled" }),
      ]);
    const recentAppointments = await Appointment.find()
      .populate("service", "title")
      .sort({ createdAt: -1 })
      .limit(5);
    res.json({
      success: true,
      data: {
        total,
        pending,
        confirmed,
        inProgress,
        completed,
        cancelled,
        recentAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
