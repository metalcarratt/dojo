<template>
    <Canvas id="canvas" width="500" height="600" ref="canvas" />
</template>

<script>
import Canvas from "@/components/VueJCanvas.vue";
import training from "./training.js";

const masterImages = {
    resting: ["master2.png", "master3.png"],
    blocking: ["master2.png", "master4.png"],
    kicking: ["master2.png", "master5.png"],
    squating: ["master2.png", "master6.png"],
    punching: ["master2.png", "master7.png"],
    collapsed: ["master8.png"]
}

const studentImages = {
    resting: ["student1.png", "student2.png"],
    blocking: ["student1.png", "student6.png"],
    kicking: ["student1.png", "student4.png"],
    squating: ["student1.png", "student5.png"],
    punching: ["student1.png", "student3.png"],
    collapsed: ["student7.png"]
}

const imageForRole = (role) => {
    switch (role) {
        case "Trainer":
            return masterImages;
        case "Student":
            return studentImages;
    }
}
const layerName = (id) => "member" + id;
const expUpName = (id) => "expUp" + id;
const getImage = (trainingProgram, masterAnimation, role, energy) => {
    if (energy === 0) {
        return imageForRole(role).collapsed[0];
    }
    const index = masterAnimation === 1 ? 0 : 1;
    switch (trainingProgram) {
        case training.STATE_RESTING:
            return imageForRole(role).resting[index];
        case training.STATE_BLOCKING:
            return imageForRole(role).blocking[index];
        case training.STATE_KICKING:
            return imageForRole(role).kicking[index];
        case training.STATE_SQUATING:
            return imageForRole(role).squating[index];
        case training.STATE_PUNCHING:
            return imageForRole(role).punching[index];
    }
}

export default {
    components: { Canvas },
    props: ["trainingProgram", "members", "expUp", "speed"],
    data() {
        return {
            masterAnimation: 1
        }
    },
    mounted() {
        this.canvas.drawRect({
            fillStyle: '#c33',
            x: 1,
            y: 1,
            width: 400,
            height: 400,
            fromCenter: false
        });

        for (let x = 0; x < 5; x++) {
            this.canvas.addLayer({
                type: 'image',
                source: "wall.gif",
                x: x * 100, y: 0, width: 100, height: 100,
                fromCenter: false
                });
            
        }

        for (let x = 0; x < 5; x++) {
            for (let y = 0; y < 5; y++) {
                this.canvas.addLayer({
                    type: 'image',
                    source: "floorboard.jpg",
                    x: x * 100, y: y * 100 + 100, width: 100, height: 100,
                    fromCenter: false
                });
                
            }
        }

        this.animationLoop();
        
    },
    computed: {
        canvas() {
            return this.$refs["canvas"].getCanvas();
        }
    },
    watch: {
        members() {
            this.members.forEach((member) => {
                this.canvas.addLayer({
                    name: layerName(member.id),
                    type: 'image',
                    source: imageForRole(member.role).resting[0],
                    x: member.position.x * 100,
                    y: member.position.y * 100 - 50,
                    width: 100,
                    height: 100,
                    fromCenter: false
                });
                this.canvas.addLayer({
                    name: expUpName(member.id),
                    type: 'text',
                    text: 'EXP UP',
                    // fillStyle: '#9cf',
                    // strokeStyle: '#25a',
                    fillStyle: '#0000',
                    strokeStyle: '#0000',
                    strokeWidth: 2,
                    x: member.position.x * 100 + 50,
                    y: member.position.y * 100 + 50,
                    fontSize: 40,
                })
            });
        },
        expUp() {
            this.members.forEach((member) => {
                const memberExpUp = this.expUp.find(exp => exp.id === member.id);
                if (memberExpUp) {

                    let expUpLayer = this.canvas.getLayer(expUpName(member.id));
                    expUpLayer.fillStyle = "#9cf";
                    if (memberExpUp.text === "Exp") {
                        expUpLayer.strokeStyle = "#25a";
                    } else {
                        expUpLayer.strokeStyle = "#c72c2c";
                    }
                    
                    expUpLayer.y = member.position.y * 100 + 50;
                    expUpLayer.text = memberExpUp.text + " Up";

                    this.canvas.animateLayer(expUpName(member.id), {
                        fillStyle: '#0000',
                        strokeStyle: '#0000',
                        y: member.position.y * 100
                    }, 1000);
                }
            });
        }
    },
    methods: {
        animationLoop() {
            this.masterAnimation = this.masterAnimation === 1 ? 2 : 1;
            for (let member of this.members) {
                const memberLayer = this.canvas.getLayer(layerName(member.id));
                memberLayer.source = getImage(this.trainingProgram, this.masterAnimation, member.role, member.energy);
            }
            this.canvas.drawLayers();
            setTimeout(() => this.animationLoop(), this.speed * 100);
            this.$emit("loop");
        }
    }
}
</script>