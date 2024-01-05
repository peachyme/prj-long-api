import { db } from "../src/utils/db.server";

type Skill = {
    label: string;
};

type Evaluation = {
    note: number;
    commentaire: string;
    date: string;
    offreurId: number;
    demandeurId: number;
};

async function seed() {
    await Promise.all(
        getSkills().map((skill) => {
            return db.skill.create({
                data: {
                    label: skill.label
                }
            });
        })
    );

    await db.demandeur.create({
        data: {
            fname: "Hadjer",
            lname: "Messaoudene",
            phone: "0744893960",
            email: "hadjer.messaoudene24@gmail.com",
            address: "61, avenue du Général de Gaulle",
            country: "France",
            city: "Créteil",
            zip: "94000",
            userId: "c131e553-e4c6-4747-bd9f-6a046e471158"
        }
    });

    await Promise.all(
        getEvaluations().map((evaluation) => {
            return db.evaluation.create({
                data: {
                    note: evaluation.note,
                    commentaire: evaluation.commentaire,
                    date: evaluation.date,
                    offreurId: evaluation.offreurId,
                    demandeurId: evaluation.demandeurId,
                }
            });
        })
    );

    /*const skill = await db.skill.findFirst({
        where: {
            label: "PHP",
        },
    });*/
}

seed();

function getEvaluations(): Array<Evaluation> {
    return [
        {
            note: 5,
            commentaire: "THE BEST EVER :D",
            date: "2023-02-24",
            offreurId: 1,
            demandeurId: 1,

        },
        {
            note: 3,
            commentaire: "mehhh it was fine :|",
            date: "2023-07-12",
            offreurId: 1,
            demandeurId: 1,

        },
    ]
};


function getSkills(): Array<Skill> {
    return [
        {
            label: "PHP"
        },
        {
            label: "JavaScript"
        },
        {
            label: "Python"
        },
        {
            label: "Java"
        },
        {
            label: "React JS"
        },
        {
            label: "Laravel"
        },
        {
            label: "Node JS"
        }
    ]
};

