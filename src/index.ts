import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) =>
  res.status(200).json({ message: "Everything is good" })
);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
