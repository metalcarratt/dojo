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
                            <th><font-awesome-icon icon="dumbbell" /></th>
                            <th><font-awesome-icon icon="hand-rock" /></th>
                            <th><font-awesome-icon icon="socks" /></th>
                            <th><font-awesome-icon icon="shield-alt" /></th>
                            <th><font-awesome-icon icon="bolt" /></th>
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

        <Dojo :trainingProgram="trainingProgram" @loop="onecycle" :members="members" :expUp="expUp" :speed="speed" />

        <div class="sidebar">
            <h2>Training Program</h2>
            <select v-model="trainingProgram">
                <option v-for="state in states" :key="state">{{ state }}</option>
            </select>

            <h2>Settings</h2>
            <label>Speed: </label>
            <button @click="speed = speed - 1">-</button>
            {{ speed }}
            <button @click="speed = speed + 1">+</button>
            (lower is faster)
            
            <h2>Goals</h2>
            <div class="goal" v-for="(goal, gindex) in goals" :key="gindex">
                <h3>{{ goal.name }}</h3>
                <p>{{ goal.detail }}</p>
            </div>

            <div class="goal completed" v-for="(goal, cindex) in completedGoals" :key="cindex">
                <h3>{{ goal.name }}</h3>
                <font-awesome-icon icon="check" />
            </div>
            
        </div>
    </div>
</template>

<script>
import Dojo from "@/components/Dojo.vue";
import training from "@/components/training.js";
import goals from "@/components/goals.js";

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
        position,
        goals: []
    };
}

const calculateExperience = (member, statName, expName, text, expUp) => {
    if (member.energy > 0) {
        member[expName] = member[expName] + 1;
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
            expUp: [],
            speed: 8,
            goals: [],
            completedGoals: []
        }
    },
    mounted() {
        let trainer = newMember(1, ROLE_TRAINER, "Bill", { x: 2, y: 1 });
        trainer.strength = 10;
        this.members.push(trainer);
        this.members.push(newMember(2, ROLE_STUDENT, "Sam", { x: 2, y: 3 }));

        this.goals.push(goals.goal1);
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
        checkCompleted(goal) {
            const completed = goal.completed(this.members);
            if (completed) {
                this.goals.splice(this.goals.indexOf(goal), 1);
                this.completedGoals.unshift(goal);
                this.goals = this.goals.concat(goal.next());
            }
            return completed;
        },
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
                .filter(member => member.role === ROLE_STUDENT)
                .forEach(member => {
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
            this.goals.forEach(goal => {
                this.checkCompleted(goal);
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

.svg-inline--fa {
    padding-left: 8px;
    padding-right: 8px;
}

td {
    text-align: center;
}

.fa-dumbbell {
    color: #d0a80a;
}

.fa-hand-rock {
    color: #b70000;
}

.fa-socks {
    color: #42429f;
}

.fa-shield-alt {
    color: green;
}

.fa-bolt {
    color: #e65a2f;
}

.goal {
    border: 1px solid black;
    padding: 4px;
    background-color: #ffffc0;
    margin-bottom: 4px;
}
.goal.completed {
    background-color: #80eb80;
}
.goal.completed .fa-check {
    float: right;
    margin-top: -40px;
    color: #184f08;
    font-size: 18px;
}
.goal h3 {
    margin-top: 0;
}
</style>
