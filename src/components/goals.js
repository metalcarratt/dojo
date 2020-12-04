const SAM = "Sam";

const goal1 = {
    id: 1,
    name: "Buff Sam up!",
    detail: "Sam is lacking in strength. Get him up to level one.",
    completed: (members) => memberByName(members, SAM).strength >= 1,
    next: () => [goal2, goal3]
}

const goal2 = {
    id: 2,
    name: "Improve Sam's skill",
    detail: "Sam needs to improve his fighting skill. Get his fist and leg skill to level one",
    completed: (members) => {
        const sam = memberByName(members, SAM);
        return sam.upperTechnique >= 1 && sam.lowerTechnique >= 1;
    }
}

const goal3 = {
    id: 3,
    name: "Improve Sam's defence",
    detail: "Sam needs to tighten up his defence. Get his defence skill to level one",
    completed: members => {
        const sam = memberByName(members, SAM);
        return sam.defence >= 1;
    }
}

const memberByName = (members, name) => {
    return members.find(member => member.name === name);
}

export default {
    goal1
}