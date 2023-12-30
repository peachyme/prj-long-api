import { db } from "../src/utils/db.server";

type Skill = {
    label: string;
};

type Offreur = {
    fname: string;
    lname: string;
    phone: string;
    email: string;
    address: string;
    country: string;
    city: string;
    zip: string;
    userId: string;
}

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

    /*const skill = await db.skill.findFirst({
        where: {
            label: "PHP",
        },
    });*/
}

seed();

function getSkills(): Array<Skill> {
    return [
        {
            label: "PHPPPPPPPPP"
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
}

