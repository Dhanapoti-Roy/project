const Request = require("../models/Request");
const AcceptedRequest = require("../models/AcceptedRequest");
const User = require("../models/User");
const Mission = require("../models/Mission");
const Conversation = require("../models/Conversation");
const { sendAdminAlert } = require("../utils/email");

// 🔥 helper (UPDATED: village বাদ)
const getArea = (r) => `${r.district}`;

// ==========================
// 🔹 CREATE GUEST REQUEST
// ==========================
const createGuestRequest = async (req, res) => {
  try {
    const { name, phone, district, subDistrict, village, trapped, need } = req.body;

    if (!name || !phone || !district || !subDistrict || !village || !trapped || !need) {
      return res.status(400).json({ message: "All guest fields required" });
    }

    // ✅ CREATE FIRST
    const request = await Request.create({
      name,
      phone,
      district,
      subDistrict,
      village,
      peopleCount: trapped,
      needType: need,
      status: "pending"
    });

    // 🔥 COUNT (UPDATED AREA LOGIC)
    const count = await Request.count({
      where: {
        district,
        subDistrict,
        status: "pending"
      }
    });

    // 🔥 SEND ONLY ONCE
    if (count === 5) {
      const area = `${district}, ${subDistrict}`;
      await sendAdminAlert(area, count);
    }

    return res.status(201).json({ message: "Request submitted", request });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to submit request" });
  }
};

// ==========================
// 🔹 CREATE USER REQUEST
// ==========================
const createUserRequest = async (req, res) => {
  try {
    const { trapped, need, district, subDistrict, village } = req.body;

    if (!trapped || !need || !district || !subDistrict || !village) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ CREATE FIRST
    const request = await Request.create({
      userId: user.id,
      name: user.name,
      phone: user.phone,
      district,
      subDistrict,
      village,
      peopleCount: trapped,
      needType: need,
      status: "pending"
    });

    // 🔥 COUNT (UPDATED AREA LOGIC)
    const count = await Request.count({
      where: {
        district,
        subDistrict,
        status: "pending"
      }
    });

    if (count === 5) {
      const area = `${district}, ${subDistrict}`;
      await sendAdminAlert(area, count);
    }

    return res.status(201).json({ message: "Request submitted", request });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to submit request" });
  }
};

// ==========================
// 🔹 GET ALL REQUESTS + ALERT
// ==========================
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({
      order: [["createdAt", "DESC"]]
    });

    const areaMap = {};

    requests
      .filter(r => r.status === "pending")
      .forEach((r) => {
        const key = getArea(r);
        areaMap[key] = (areaMap[key] || 0) + 1;
      });

    const alerts = Object.entries(areaMap)
      .filter(([_, count]) => count >= 5)
      .map(([area, count]) => ({ area, count }));

    return res.json({
      requests,
      alerts
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch requests" });
  }
};

// ==========================
// 🔹 GET ACCEPTED REQUESTS
// ==========================
const getAcceptedRequests = async (req, res) => {
  try {
    const requests = await AcceptedRequest.findAll({
      order: [["createdAt", "DESC"]]
    });

    return res.json(requests);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch accepted requests" });
  }
};

// ==========================
// 🔹 UPDATE REQUEST STATUS
// ==========================
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await Request.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: "Not found" });

    const area = getArea(request);

    // =====================
    // 🔥 APPROVE
    // =====================
    if (status === "approved") {

      await AcceptedRequest.create({
        originalRequestId: request.id,
        userId: request.userId,
        name: request.name || "Registered User",
        phone: request.phone,
        district: request.district,
        subDistrict: request.subDistrict,
        village: request.village,
        peopleCount: request.peopleCount,
        needType: request.needType,
        status: "approved"
      });

      if (request.userId) {
        await Conversation.create({
          type: "private",
          participants: [request.userId, req.user.id]
        });
      }

      await request.update({ status: "approved" });

      // 🔥 MISSION TRIGGER
      const approvedCount = await AcceptedRequest.count({
        where: {
          district: request.district,
          subDistrict: request.subDistrict
        }
      });

      if (approvedCount >= 3) {
  const existingMission = await Mission.findOne({
    where: { area, status: "active" }
  });

  if (!existingMission) {

    // 🔥 FIND VOLUNTEER HEAD (same district)
    const volunteerHead = await User.findOne({
      where: {
        role: "volunteer",
        district: request.district
      }
    });

    if (!volunteerHead) {
      console.log("❌ No volunteer found for district:", request.district);
      return;
    }

    // 🔥 CREATE MISSION WITH ASSIGNMENT
    await Mission.create({
      area,
      status: "active",
      volunteerHeadId: volunteerHead.id
    });

    console.log("✅ Mission assigned to:", volunteerHead.id);
  }
}

      return res.json({
        message: "Request approved",
        notify: "Rescue team is on the way"
      });
    }

    // =====================
    // 🔥 DECLINE
    // =====================
    await request.update({ status: "declined" });

    return res.json({
      message: "Request declined",
      notify: "Please try again later"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update status" });
  }
};

module.exports = {
  createGuestRequest,
  createUserRequest,
  getAllRequests,
  getAcceptedRequests,
  updateRequestStatus
};