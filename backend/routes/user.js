const express = require("express");
const zod = require("zod");
const router = express.Router();
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { Account } = require("../db");

const { authMiddleware } = require("../middleware");

const signupSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});
router.post("/signup", async (req, res) => {
  console.log("POST /signup body:", {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    passwordLen: req.body?.password?.length,
  });

  const body = req.body;
  const { success } = signupSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "incorrect innputs  ",
    });
  }
  const user = await User.findOne({
    username: req.body.username,
  });
  if (user) {
    return res.json({
      messgae: "Email already taken/ incorrect inputs",
    });
  }

  const dbUser = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  /// ----- Create new account ------

  await Account.create({
    userId: dbUser._id,
    balance: 1 + Math.random() * 10000,
  });

  const token = jwt.sign(
    {
      userId: dbUser._id,
    },
    JWT_SECRET
  );
  res.json({
    message: "user created successfully",
    token: token,
  });
  console.log("✓ user created:", {
    id: dbUser._id.toString(),
    username: dbUser.username,
  });
});
const singinSchema = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});
router.post("/signin", async (req, res) => {
  const { success } = singinSchema.safeParse(req.body);
  if (!success) {
    res.json({
      message: "Incorrect /Inputs",
    });
  }
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });
  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );
    res.json({
      token: token,
    });
    return;
  }
  res.json({
    message: "Eror while logging in",
  });
});

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});
router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating the information",
    });
  }
  await User.updateOne(
    {
      _id: req.userid,
    },
    req.body
  );
  res.json({
    message: "Updated Successfully ",
  });
});
router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });
  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});
module.exports = router;
// if there is if check partially
