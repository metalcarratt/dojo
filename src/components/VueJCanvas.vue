<template>
    <canvas :id="id" :width="width" :height="height" />
</template>

<script>
import $ from 'jquery';
import jcanvas from 'jcanvas';

jcanvas($, window);

export default {
    props: ["id", "width", "height"],
    methods: {
        getCanvas() {
            return this.id ? $("#" + this.id) : $("canvas");
        }
    }
}
</script>