const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDb = require("./config/db");
require("dotenv").config();
const userRouter = require("./routes/user.routes");
const calendarRoutes = require("./routes/calendar.routes");
const account = require("./routes/account.route");
const kanbanRoutes = require("./routes/kanban.route");
const noteRoutes = require("./routes/note.routes");

const app = express();
// middleware cho phép domain khác có thể gửi yêu cầu và nhận res
app.use(cors());

app.use(bodyParser.json()); // express.json()
app.use(bodyParser.urlencoded({ extended: true })); // express.urlencoded

// Serve static files from uploads directory
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(`${process.env.MONGO_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Kết nối MongoDB thành công!");
  })
  .catch((err) => {
    console.error("❌ Kết nối MongoDB thất bại:", err.message);
  });

// app.use("/api/user", userRouter);
app.use("/api/user", userRouter);
// app.use("/api", userRouter);
app.use("/api", calendarRoutes);
app.use("/api", account);
app.use("/api", kanbanRoutes);
app.use("/api", noteRoutes);

connectDb();
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
