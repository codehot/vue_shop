<template>
    <div>
        <h1>Welcome</h1>
        <div>
            {{$store.state.counter}}
        </div>
        <div>{{$store.getters.powercounter}}</div>
        <el-button @click="addition"></el-button>
        <el-button @click="subtraction"></el-button>
    </div>
</template>

<script>
export default {
    data(){
        return {

        }
    },

    methods:{
        addition(){
            this.$store.commit("increment")
        },
        subtraction(){
            this.$store.commit("decrement")
        },
    }
}
</script>