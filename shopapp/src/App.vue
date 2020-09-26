<template>
  <div id="nav">
    
  </div>
  
</template>

<script>
import {request} from './network/request'

export default {
  data(){
    return {}
  },
  created(){
    this.getHomeData()
  },

  methods:{
    async getHomeData (){
      const res = await request({url:'shopapi/homedata'})
      console.log(res);
    }
  }
}
</script>

<style>

</style>
