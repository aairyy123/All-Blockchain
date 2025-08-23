const express = require("express");
const cors = require("cors");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/blogs", blogRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
