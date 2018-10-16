<template>
  <div id="app">
    <transition name="slide-fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <div class="copyright">
      Yiyang Gao 2018. Licensed under The Unlicense.
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  background: linear-gradient(45deg, #EECDA3 0, #CCAB81 130%);
  box-shadow: inset 0 0 0 8px rgba(0, 0, 0, .5);
  min-height: 100vh;
  padding-bottom: 3em;
  line-height: 1.5;
  overflow: auto;
  margin: 0;
}

body {
  margin: 0;
}

.slide-fade-enter-active {
  transition: all 175ms cubic-bezier(0.0, 0.0, 0.2, 1);
}
.slide-fade-leave-active {
  transition: all 200ms cubic-bezier(0.4, 0.0, 1, 1);
}
.slide-fade-enter {
  filter: blur(5px);
  transform: translateX(10px);
  opacity: 0;
}
.slide-fade-leave-to {
  filter: blur(5px) hue-rotate(-90deg);
  transform: translateX(-25px);
  opacity: 0;
}

  .copyright {
    position: fixed;
    right: 8px;
    bottom: 8px;
    color: #efefef;
    font-size: 14px;
    background: rgba(0, 0, 0, .6);
    padding: .5em 1em;
    border-radius: .25em 0 0 0;
  }
</style>
