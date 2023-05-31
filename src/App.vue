<script setup>
import { KeepAlive } from 'vue';


</script>

<template>
  <div class="navator">
    <router-link class="link" to="/">在线编辑</router-link>
    <router-link class="link" to="/leetcode">算法刷题</router-link>
    <router-link class="link" to="/md">添加笔记</router-link>
    <router-link class="link" to="/addQuestion">添加算法题目</router-link>
  </div>
  <div style="height:calc(100% - 30px)">
    <router-view v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </router-view>
  </div>
</template>

<style scoped lang="scss">
.navator {
  display: flex;
  height: 30px;
  border-bottom: 1px solid #ccc;

  .link {
    text-align: center;
    line-height: 30px;
    width: 120px;
    height: 30px;
    text-decoration: none;
    border-radius: 15px;
    border: 1px solid #ccc;
  }
}
</style>
