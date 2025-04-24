const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDb = require('./config/db');
require('dotenv').config();
const userRouter = require('./routes/user.routes')
const authRoutes = require("./routes/auth.routes");
const calendarRoutes = require("./routes/calendar.routes")
const noteRoutes = require("./routes/note.routes")
const app = express();
// middleware cho phép domain khác có thể gửi yêu cầu và nhận res
app.use(cors());

app.use(bodyParser.json()); // express.json()
app.use(bodyParser.urlencoded({ extended: true })); // express.urlencoded

app.use('/api', userRouter)
app.use("/api", authRoutes);
app.use('/api', calendarRoutes)
app.use("/api", noteRoutes);
connectDb();
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});