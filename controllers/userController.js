import { Avatar, User } from "../model/userModels.js";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
  console.log("register route");
  try {
    const { username, email, password } = req.body;

    const userNameCheck = await User.findOne({ username });
    if (userNameCheck)
      return res.json({ msg: "This username is already used", status: false });

    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "This email is already used", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;

    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  console.log("login route");
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.json({ msg: "Incorrect username", status: false });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect password", status: false });
    delete user.password;

    console.log(user);
    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

export const setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (err) {
    next(err);
  }
};

export const getAvatars = async (req, res, next) => {
  console.log("add avatar", req);
  try {
    const avatars = await Avatar.find({});
    return res.json({ avatars });
  } catch (err) {
    next(err);
  }
};
