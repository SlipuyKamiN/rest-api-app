const Contact = require("../models/contacts");

const { HttpError } = require("../utils/HttpError");
const { ctrlWrapper } = require("../utils/ctrlWrapper");

const getAll = async (req, res) => {
  const data = await Contact.find({}, "-createdAt -updatedAt");

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
  const { body } = req;
  const data = await Contact.create(body);

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
