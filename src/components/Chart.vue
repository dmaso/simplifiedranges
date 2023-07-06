<template>
  <div class="">
    <div class="grid grid-cols-13">
      <div
        v-for="(handClass, index) in handClasses"
        :key="index"
        :style="createGradientStyle(getRangeSummary(handClass))"
        class="border border-gray-200 rounded shadow-sm px-2 py-2 text-center text-white text-sm text-black"
      >
        {{ handClass }}
      </div>
    </div>
  </div>
</template>
