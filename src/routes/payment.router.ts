import express from "express";
import type { Response, Request } from "express";
import Stripe from "stripe";

import * as DemandeController from "../controllers/demande.demandeur.controller";
import * as ProjetController from "../controllers/project.offreur.controller";
import * as DemandeurController from "../controllers/demandeur.controller";
import * as OffreurController from "../controllers/offreur.controller";
import { isEmailVerified, isAuthenticated, isDemandeur, isDemandeurProfileOwner, isDemandeOwner } from "../middleware";
import { Etat } from "@prisma/client";
import { sendDemandeAnnuleeEmail, sendDemandeConfirmeeEmail, sendDemandeConfirmeeOffreurEmail, sendDemandeEnvoyeeEmail, sendDemandeModifieeEmail, sendNewDemandeEmail } from "../utils/nodemailer";

export const paymentRouter = express.Router();
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!);



// POST: payer la demande
paymentRouter.put("/:id/demandes/:dId/create-checkout-session", isAuthenticated, isEmailVerified, isDemandeur, isDemandeOwner, 
                    async (request: Request, response: Response
                ) => {
    try {
        const id: number = parseInt(request.params.dId, 10);
        const demande = await DemandeController.getDemande(id);

        if (demande?.etat !== "acceptee") {
            return response.status(404).json({"message": "Action forbidden : Demande not accepted or already paid"});
        }
        else {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                mode: "payment",
                line_items: [
                    {
                        price_data: {
                            currency: "eur",
                            product_data: {
                                name: `Demande de service : ${demande.title}`
                            },
                            unit_amount: demande.facture?.montant,
                        },
                        quantity: 1
                    }
                ],
                success_url: `${process.env.SERVER_URL}/success`,
                cancel_url: `${process.env.SERVER_URL}/cancel`,
                metadata: {
                    demandeId: demande.id
                },

              });
              response.json({ session });
        }
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});

// Webhook endpoint to handle events from Stripe
paymentRouter.post('/webhook', async (req: Request, res: Response) => { 
  
    try {
        if (req.body.type === 'checkout.session.completed') {
            const event = req.body.data.object;
            // get the checkout session
            const session = await stripe.checkout.sessions.retrieve(event.id);

            // get the metadata from the session aka la demande and confirm it
            if (session.metadata) {
                const demandeId =  parseInt(session.metadata.demandeId, 10);

                // confirm demande :
                const confirmedDemande = await DemandeController.confirmDemande(demandeId);    
                
                const demandeur = await DemandeurController.getDemandeur(confirmedDemande.demandeurId)
                const offreur = await OffreurController.getOffreur(confirmedDemande.offreurId)

                // create project :
                const projet = {
                    title: confirmedDemande.title,
                    description: confirmedDemande.description, 
                    cc: confirmedDemande.cc, 
                    demandeurId: confirmedDemande.demandeurId,
                    offreurId: confirmedDemande.offreurId,
                    demandeId: confirmedDemande.id
                }
                await ProjetController.createProjet(projet);

                if (demandeur && offreur) {
                    sendDemandeConfirmeeEmail(demandeur.email, demandeur.lname, demandeur.fname, confirmedDemande.title);
                    sendDemandeConfirmeeOffreurEmail(offreur.email, offreur.lname, offreur.fname, confirmedDemande.title)
                }
                
                
                
            }
           
        }
    
    } catch (error: any) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  

  });


