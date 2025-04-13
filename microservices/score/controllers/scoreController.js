const Upload = require("../models/Upload");
const Target = require("../models/Target");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const FormData = require('form-data');

const IMAGGA_ENDPOINT = "https://api.imagga.com/v2/tags";
const AUTH_HEADER = {
  auth: {
    username: "acc_e3af8817aef8149",
    password: "497ccbf294a2db5a865c92dc71d6bf58"
  }
};

async function analyzeImageBuffer(buffer) {
  const base64 = buffer.toString("base64");
  const filePath = path.join(__dirname, "temp.jpg");
  fs.writeFileSync(filePath, buffer);

  const formData = new FormData();
  formData.append("image", fs.createReadStream(filePath));

  try {
    const response = await axios.post(IMAGGA_ENDPOINT, formData, {
      ...AUTH_HEADER,
      headers: formData.getHeaders()
    });

    fs.unlinkSync(filePath);

    return response.data.result.tags.map(tag => tag.tag.en);
  } catch (err) {
    console.error("❌ Imagga API fout:", err.message);
    return [];
  }
}

function calculateSimilarity(tagsA, tagsB) {
  const common = tagsA.filter(tag => tagsB.includes(tag));
  const percent = (common.length / Math.max(tagsA.length, tagsB.length)) * 100;
  return Math.round(percent);
}

exports.getScore = async (req, res) => {
  const uploadId = req.params.uploadId;
  console.log("Upload ID:", uploadId);

  try {
    const upload = await Upload.findOne({ uploadId: uploadId });
    if (!upload) return res.status(404).json({ msg: "Upload niet gevonden" });

    const target = await Target.findOne({ targetId: upload.targetId });

    if (!target) return res.status(404).json({ msg: "Target niet gevonden" });

    const tagsUpload = await analyzeImageBuffer(upload.img.data);
    const tagsTarget = await analyzeImageBuffer(target.img.data);

    const score = calculateSimilarity(tagsUpload, tagsTarget);

    return res.json({ score });
  } catch (err) {
    console.error("Fout bij score berekening:", err);
    return res.status(500).json({ msg: "Interne serverfout" });
  }
};

exports.getScoreId = async (temp) => {
  const id = temp.uploadId;
  try {
    const upload = await Upload.findOne({ uploadId: id });

    if (!upload) return { msg: "geen upload target gevonden" }

    const target = await Target.findOne({ targetId: upload.targetId });

    if (!target) return { msg: "Target niet gevonden" };

    const tagsUpload = await analyzeImageBuffer(upload.img.data);
    const tagsTarget = await analyzeImageBuffer(target.img.data);

    const score = calculateSimilarity(tagsUpload, tagsTarget);

    return ({ score });
  } catch (err) {
    console.error("Fout bij score berekening:", err);
    return { msg: "Interne serverfout" };
  }
};

exports.getAllScores = async (targetId) => {
  console.log("Target ID:", targetId);

  try {
    const uploads = await Upload.find({ targetId });
    console.log("Uploads gevonden:", uploads);

    const target = await Target.findOne({ targetId: targetId });
    if (!target || uploads.length === 0) return { msg: "Geen uploads of target gevonden" };

    const tagsTarget = await analyzeImageBuffer(target.img.data);

    const scores = [];

    for (const upload of uploads) {
      const tagsUpload = await analyzeImageBuffer(upload.img.data);
      const score = calculateSimilarity(tagsUpload, tagsTarget);
      console.log("User", upload.userId, "heeft een score van", score);

      scores.push({
        userId: upload.userId,
        uploadId: upload.uploadId,
        score: score
      });
    }

    return scores;
  } catch (err) {
    console.error("Fout bij ophalen van scores", err);
    return { msg: "Interne serverfout" };
  }
};

exports.getWinner = async (targetId) => {
  console.log("Target ID:", targetId);

  try {
    const uploads = await Upload.find({ targetId });
    console.log("Uploads gevonden:", uploads);

    const target = await Target.findOne({ targetId: targetId });
    if (!target || uploads.length === 0) return { msg: "Geen uploads of target gevonden" };

    const tagsTarget = await analyzeImageBuffer(target.img.data);
    let bestScore = 0;
    let bestUser = null;

    for (const upload of uploads) {
      const tagsUpload = await analyzeImageBuffer(upload.img.data);
      const score = calculateSimilarity(tagsUpload, tagsTarget);
      if (score > bestScore) {
        bestScore = score;
        bestUser = upload.userId;
      }
    }

    return { userId: bestUser, score: bestScore };
  } catch (err) {
    console.error("Fout bij berekenen van winnaar:", err);
    return { msg: "Interne serverfout" };
  }
};