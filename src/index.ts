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
import { projetDemandeurRouter } from "./routes/project.demandeur.router";
import { projetOffreurRouter } from "./routes/project.offreur.router";
import { membresProjetRouter } from "./routes/membres.project.router";
import { tachesRouter } from "./routes/taches.project.router";
import { evaluationRouter } from "./routes/evaluation.router";

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
app.use('/api/offreurs', evaluationRouter);
app.use('/api/offreur', experienceRouter);
app.use('/api/demandeur', projetDemandeurRouter);
app.use('/api/offreur', demandeOffreurRouter);
app.use('/api/demandeurs', demandeurRouter);
app.use('/api/demandeur', demandeDemandeurRouter);
app.use('/api/demandeur', paymentRouter);
app.use('/api/offreur', projetOffreurRouter);
app.use('/api/projets', membresProjetRouter);
app.use('/api/projet', tachesRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
