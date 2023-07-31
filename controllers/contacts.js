const Contact = require("../models/contacts");

const { HttpError } = require("../utils/HttpError");
const { ctrlWrapper } = require("../utils/ctrlWrapper");

const getAll = async (req, res) => {
  const owner = req.user._id;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const data = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner");

  res.json(data);
};

const getById = async (req, res) => {
  const { params } = req;

  const data = await Contact.findById(params.contactId);

  if (!data) {
    throw HttpError(404, "Not found");
  }

  res.json(data);
};

const createNew = async (req, res) => {
  const { body, user } = req;
  const owner = user._id;
  const data = await Contact.create({ ...body, owner });

  if (!data) {
    throw HttpError();
  }

  res.status(201).json(data);
};

const deleteById = async (req, res) => {
  const {
    params: { contactId },
  } = req;

  const data = await Contact.findByIdAndDelete(contactId);

  if (!data) {
    throw HttpError(404, "Not found");
  }

  res.json({ message: "contact deleted" });
};

const updateById = async (req, res) => {
  const {
    params: { contactId },
    body,
  } = req;

  const data = await Contact.findByIdAndUpdate(contactId, body, { new: true });

  if (!data) {
    throw HttpError(404, "Not found");
  }

  res.json(data);
};

const updateStatusContact = async (req, res) => {
  const {
    params: { contactId },
    body,
  } = req;

  const data = await Contact.findByIdAndUpdate(contactId, body, {
    new: true,
    runValidators: true,
  });

  if (!data) {
    throw HttpError(404, "Not found");
  }

  res.json(data);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  createNew: ctrlWrapper(createNew),
  deleteById: ctrlWrapper(deleteById),
  updateById: ctrlWrapper(updateById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
