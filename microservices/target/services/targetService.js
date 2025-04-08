const Target = require("../models/Target");

exports.create = async (data, ownerId) => {
  const newTarget = new Target({ ...data, ownerId });
  return await newTarget.save();
};

exports.getAll = async () => {
  return await Target.find();
};

exports.delete = async (targetId, userId) => {
  const target = await Target.findById(targetId);
  if (!target) {
    return { status: 404, message: "Target not found" };
  }
  if (target.ownerId !== userId) {
    return { status: 403, message: "Not authorized" };
  }
  await Target.findByIdAndDelete(targetId);
  return { status: 200, message: "Target deleted" };
};