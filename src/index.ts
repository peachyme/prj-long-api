import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { skillRouter } from "./routes/skill.router";
import { authRouter } from "./routes/auth.router";
import { offreurRouter } from "./routes/offreur.router";
import { experienceRouter } from "./routes/experience.router";
import { demandeurRouter } from "./routes/demandeur.router";
import { demandeDemandeurRouter } from "./routes/demande.demandeur.router";
import { demandeOffreurRouter } from "./routes/demande.offreur.router";
import { paymentRouter } from "./routes/payment.router";

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
app.use('/api/offreurs', offreurRouter);
app.use('/api/offreur', experienceRouter);
app.use('/api/offreur', demandeOffreurRouter);
app.use('/api/demandeurs', demandeurRouter);
app.use('/api/demandeur', demandeDemandeurRouter);
app.use('/api/demandeur', paymentRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
