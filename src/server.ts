import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();
const port = 3000;

app.use(express.json());
app.use("/api", userRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

