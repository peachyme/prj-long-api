import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { skillRouter } from "./routes/skill.router";
import { authRouter } from "./routes/auth.router";
import { OffreurRouter } from "./routes/offreur.router";
import { ExperienceRouter } from "./routes/experience.router";

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRouter);
app.use("/api/skills", skillRouter);
app.use('/api/offreurs', OffreurRouter);
app.use('/api/offreur', ExperienceRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
