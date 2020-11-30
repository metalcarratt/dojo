<template>
    <div id="app">
        <h1>My Dojo</h1>
        <div class="sidebar left">
            <h2>Members</h2>
            <ul>
                <li v-for="member in members" :key="member.id">
                    <label>{{ member.name }}</label>
                    <table>
                        <tr>
                            <th>Role</th>
                            <th>Str</th>
                            <th>Upp</th>
                            <th>Low</th>
                            <th>Def</th>
                            <th>Eng</th>
                            <th>Exp</th>
                        </tr>
                        <tr>
                            <td>{{ member.role }}</td>
                            <td>{{ member.strength }}</td>
                            <td>{{ member.upperTechnique }}</td>
                            <td>{{ member.lowerTechnique }}</td>
                            <td>{{ member.defence }}</td>
                            <td>{{ member.energy }}</td>
                            <td>{{ squating ? member.strengthExperience : kicking ? member.lowerExperience : punching ? member.upperExperience : blocking ? member.defenceExperience : '' }}</td>
                        </tr>
                    </table>
                </li>
            </ul>

        </div>

        <Dojo :trainingProgram="trainingProgram" @loop="onecycle" :members="members" :expUp="expUp" />

        <div class="sidebar">
            <h2>Training Program</h2>
            <select v-model="trainingProgram">
                <option v-for="state in states" :key="state">{{ state }}</option>
            </select>
        </div>
    </div>
</template>

<script>
import Dojo from "@/components/Dojo.vue";
import training from "@/components/training.js";

const ROLE_TRAINER = "Trainer";
const ROLE_STUDENT = "Student";

const newMember = (id, role, name, position)=> {
    return {
        id,
        role,
        name,
        strength: 0,
        strengthExperience: 0,
        upperTechnique: 0,
        upperExperience: 0,
        lowerTechnique: 0,
        lowerExperience: 0,
        defence: 0,
        defenceExperience: 0,
        energy: 20,
        position
    };
}

const calculateExperience = (member, statName, expName, text, expUp) => {
    member[expName] = member[expName] + 1;
    if (member.energy > 0) {
        member.energy = member.energy - 1;
        if (member[expName] === (member[statName] + 1) * 5) {
            member[statName] = member[statName] + 1;
            member[expName] = 0;
            expUp.push({id: member.id, text});
        } else {
            expUp.push({id: member.id, text: "Exp"});
        }
    }
}

export default {
    name: "App",
    components: { Dojo },
    data() {
        return {
            trainingProgram: training.STATE_RESTING,
            states: training.trainingRegimes,
            members: [],
            cycle: 0,
            expUp: []
        }
    },
    mounted() {
        let trainer = newMember(1, ROLE_TRAINER, "Bill", { x: 2, y: 1 });
        trainer.strength = 10;
        this.members.push(trainer);
        this.members.push(newMember(2, ROLE_STUDENT, "Sam", { x: 2, y: 3 }));
    },
    computed: {
        squating() {
            return this.trainingProgram === training.STATE_SQUATING;
        },
        kicking() {
            return this.trainingProgram === training.STATE_KICKING;
        },
        punching() {
            return this.trainingProgram === training.STATE_PUNCHING;
        },
        blocking() {
            return this.trainingProgram === training.STATE_BLOCKING;
        },
        resting() {
            return this.trainingProgram === training.STATE_RESTING;
        }
    },
    methods: {
        onecycle() {
            this.cycle = this.cycle + 1;
            if (this.cycle > 1) {
                this.cycle = 0;
                this.oneturn();
            }
        },
        oneturn() {
            this.expUp = [];
            this.members
                .filter((member) => member.role === ROLE_STUDENT)
                .forEach((member) => {
                    if (this.squating) {
                        calculateExperience(member, "strength", "strengthExperience", "Str", this.expUp);
                    } else if (this.kicking) {
                        calculateExperience(member, "lowerTechnique", "lowerExperience", "Low", this.expUp);
                    } else if (this.punching) {
                        calculateExperience(member, "upperTechnique", "upperExperience", "Upp", this.expUp);
                    } else if (this.blocking) {
                        calculateExperience(member, "defence", "defenceExperience", "Def", this.expUp);
                    } else if (this.resting && member.energy < 20) {
                        member.energy = member.energy + 2;
                    }
                });
        }
    }

}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    
    color: #2c3e50;
}

h1 {
    text-align: center;
}

.sidebar {
    display: inline-block;
    width: 300px;
    vertical-align: top;
    padding-left: 40px;
    padding-right: 40px;
}
</style>
