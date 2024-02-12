import express from "express";
import type { Response, Request } from "express";
import Stripe from "stripe";

import * as DemandeController from "../controllers/demande.demandeur.controller";
import { isEmailVerified, isAuthenticated, isDemandeur, isDemandeurProfileOwner, isDemandeOwner } from "../middleware";
import { Etat } from "@prisma/client";
import { sendDemandeAnnuleeEmail, sendDemandeEnvoyeeEmail, sendDemandeModifieeEmail, sendNewDemandeEmail } from "../utils/nodemailer";

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
            return response.status(404).json({"message": "Action forbidden : Demande not accepted"});
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
                }
              });
              response.json({ session, demande });
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
                const confirmedDemande = await DemandeController.confirmDemande(demandeId);
                console.log(confirmedDemande);
                
            }
           
        }
    
    } catch (error: any) {
      console.error('Error verifying webhook signature:', error.message);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  

  });


