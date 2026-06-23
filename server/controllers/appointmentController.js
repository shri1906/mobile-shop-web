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

    const service = await Service.findById(serviceId);
    if (!service)
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });

    const date = new Date(appointmentDate);
    if (date < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Please select a future date" });
    }

    const appointment = await Appointment.create({
      name,
      email,
      phone,
      service: serviceId,
      deviceModel,
      issueDescription,
      appointmentDate: date,
      appointmentTime,
    });

    const populated = await appointment.populate(
      "service",
      "title price duration",
    );
    res
      .status(201)
      .json({
        success: true,
        message: "Appointment booked successfully!",
        data: populated,
      });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("service", "title price category")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: appointments });
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

exports.updateStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
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
