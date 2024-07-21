import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { sendNotification } from "./utils";

const prismaClient = new PrismaClient();
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) =>
  res.status(200).json({ message: "Everything is good" })
);

app.post("/referral", async (req, res) => {
  const {
    referrerName,
    referrerEmail,
    referrerPhone,
    refereeName,
    refereeEmail,
    refereePhone,
    courseName,
    personalMessage,
  } = req.body;

  // Validate input
  if (
    !referrerName ||
    !referrerEmail ||
    !refereeName ||
    !refereeEmail ||
    !courseName
  ) {
    return res
      .status(400)
      .json({ error: "All required fields must be provided" });
  }

  try {
    // check if the referrer already exists
    let referrer = await prismaClient.referrer.findUnique({
      where: { email: referrerEmail },
    });

    // if not, create a new referrer
    if (!referrer) {
      referrer = await prismaClient.referrer.create({
        data: {
          name: referrerName,
          email: referrerEmail,
          phoneNumber: referrerPhone,
        },
      });
    }

    // create the referee
    const referee = await prismaClient.referee.create({
      data: {
        name: refereeName,
        email: refereeEmail,
        phoneNumber: refereePhone,
        courseName,
        referrerId: referrer.id,
        personalMessage,
      },
    });

    // create the referral entry
    const referral = await prismaClient.referral.create({
      data: {
        referrerId: referrer.id,
        refereeId: referee.id,
      },
    });

    // Send email notification
    sendNotification(referrerName, refereeName, refereeEmail, courseName);

    res.status(200).json(referral);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating referral" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
