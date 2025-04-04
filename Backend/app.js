const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
const cookieParser = require("cookie-parser");
const connectToDb = require("./db/db");
const userRoutes = require("./routes/user.routes");
const lawyerRoutes = require("./routes/lawyer.routes");
const mongoose = require('mongoose');

const ImageKit = require("imagekit");

const Chat = require("./models/chat.model.js");
const UserChats = require("./models/userChats.model.js");

// Remove Clerk middleware and import your custom auth middleware instead
const { authUser } = require("./middlewares/auth.middleware");

connectToDb();


app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/users", userRoutes);
app.use("/lawyers", lawyerRoutes);

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

// Endpoint for ImageKit upload authentication
app.get("/api/upload", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
});

// POST: Create a new chat and add it to UserChats
app.post("/api/chats", authUser, async (req, res) => {
  const userId = req.user._id;
  const { text } = req.body;

  try {
    // Create a new chat document with the user's initial message
    const newChat = new Chat({
      userId,
      history: [
        {
          role: "user",
          parts: [{ text }],
        },
      ],
    });
    const savedChat = await newChat.save();

    // Check if the user already has a UserChats document
    const userChats = await UserChats.find({ userId });
    if (!userChats.length) {
      const newUserChats = new UserChats({
        userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });
      await newUserChats.save();
    } else {
      // Append new chat to the existing UserChats document
      await UserChats.updateOne(
        { userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );
    }
    // Respond with the new chat's ID
    res.status(201).json({ id: savedChat._id.toString() });

  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

// GET: Retrieve all chats for the authenticated user
app.get("/api/userchats", authUser, async (req, res) => {
  const userId = req.user._id;
  try {
    const userChats = await UserChats.find({ userId });
    if (userChats.length > 0) {
      res.status(200).send(userChats[0].chats);
    } else {
      res.status(200).send([]); // No chats found, return empty array
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

// GET: Retrieve a specific chat by its ID for the authenticated user
app.get("/api/chats/:id", authUser, async (req, res) => {
  const userId = req.user._id;
  const chatId = req.params.id;

  // Validate that chatId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    console.log("Invalid chat id provided:", chatId);
    return res.status(400).send("Invalid chat id");
  }

  try {
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      console.log(`Chat not found for id: ${chatId} and userId: ${userId}`);
      return res.status(404).send("Chat not found");
    }
    console.log("Chat found:", chat);
    res.status(200).json(chat);
  } catch (error) {
    console.error("Error in GET /api/chats/:id:", error);
    res.status(500).send("Internal chat error");
  }
});

// PUT: Append a new message (user question and model answer) to a chat's history
app.put("/api/chats/:id", authUser, async (req, res) => {
  const userId = req.user._id;
  const { question, answer, img } = req.body;

  // Build the new history items array. If a question exists, add it (with optional image), then add the model answer.
  const newItems = [
    ...(question
      ? [
          {
            role: "user",
            parts: [{ text: question }],
            ...(img && { img }),
          },
        ]
      : []),
    {
      role: "model",
      parts: [{ text: answer }],
    },
  ];

  try {
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $push: { history: { $each: newItems } } },
      { new: true }
    );
    res.status(200).send(updatedChat);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error adding to chat");
  }
});

// DELETE: Remove a chat and its reference from UserChats
app.delete("/api/chats/:id", authUser, async (req, res) => {
  const userId = req.user._id;
  const chatId = req.params.id;

  // Validate chatId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).send("Invalid chat id");
  }

  try {
    // Delete the chat from the Chat collection
    const deletedChat = await Chat.findOneAndDelete({ _id: chatId, userId });
    if (!deletedChat) {
      return res.status(404).send("Chat not found");
    }

    // Remove the chat reference from the UserChats document
    await UserChats.updateOne(
      { userId },
      { $pull: { chats: { _id: chatId } } }
    );

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).send("Internal server error");
  }
});



// Global error handler for unauthorized access
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(401).send("Unauthorized");
});

module.exports = app;
