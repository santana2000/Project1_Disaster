<template>
    <div id="app">
        <!-- <div id="nav">
      <router-link to="/">Home</router-link>     |    
      <router-link to="/about">Test</router-link>
    </div> -->	
        <!-- <router-view/> -->
        <Title></Title>
        <Home></Home>
    </div>
</template>
<script>
import Title from "@/views/Title";
import Home from "@/views/Home";
export default {
    components: { Title, Home },
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

#nav {
    padding: 30px;
    background-color: rgb(211, 211, 211);
    margin-bottom: 10px;
    /* height: 120px; */
}

#nav a {
    font-weight: bold;
    color: #2c3e50;
}

#nav a.router-link-exact-active {
    color: #42b983;
}
.cesium-performanceDisplay-defaultContainer {
    right: 20px;
    top: 650px;
}
</style>
