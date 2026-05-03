require("dotenv").config();
const AWS = require("aws-sdk");
const express = require("express");
const router = express.Router();

const Expense = require("../models/expense");
const Report = require("../models/report");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

const reportDownloadedList = async (req, res) => {
  try {

    // 1. Get expenses from DB
    const expenses = await Expense.findAll({
      where: { userId: req.user.userId }
    });

    let csv = "Date,Description,Category,Expense\n";

    expenses.forEach(e => {
      csv += `${e.createdAt},${e.description},${e.category},${e.amount}\n`;
    });

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `reports/report-${Date.now()}.csv`,
      Body: csv,
      ContentType: "text/csv",
    };

    // 4. Upload to S3
    const upload = await s3.upload(params).promise();

    // console.log("UPLOAD RESPONSE:", upload);
    // console.log("S3 LOCATION:", upload.Location);

    if (!upload.Location) {
      throw new Error("S3 upload failed - no location returned");
    }

    // 5. Save in DB
    await Report.create({
      userId: req.user.userId,
      url: upload.Location,
      fileName: `report-${Date.now()}.csv`
    });

    // 6. Return response
    res.json({
      success: true,
      url: upload.Location
    });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { reportDownloadedList };