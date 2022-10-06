import { Messages } from "../model/messageModel";

export const addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) {
      return res.json({ msg: "Message added successfully" });
    } else {
      res.json({ msg: "Failed to add message to the database" });
    }
  } catch (err) {
    next(err);
  }
};

export const getAllMessages = async (req, res, next) => {};
