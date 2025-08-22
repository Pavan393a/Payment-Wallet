const express = require("express");
const app = express();
var cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", // your Vite dev server
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);
app.use(express.json());

const mainRouter = require("./routes/index");

app.use("/api/v1", mainRouter);
// app.use("api/v1/users");
app.use((req, res) => res.status(404).json({ message: "Not found" }));

// 5) Global error handler (prevents server from crashing)
app.use((err, req, res, next) => {
  console.error(err);
  if (!res.headersSent)
    res.status(500).json({ message: "Internal Server Error" });
});
app.listen(3000, function () {
  console.log("Local host is running on 3000");
});
