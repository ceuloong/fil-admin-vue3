<template>
  <div class="basic-layout">
    <slot name="wrapper"></slot>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.basic-layout {
  box-sizing: border-box;
  padding: 10px;
}
</style>
