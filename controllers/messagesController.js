import { Messages } from "../model/messageModel.js";

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

export const getAllMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const messages = await Messages.find({ users: { $all: [from, to] } }).sort({
      updatedAt: 1,
    });

    const messagesWithSender = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(messagesWithSender);
  } catch (err) {
    next(err);
  }
};
