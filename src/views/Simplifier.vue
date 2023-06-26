<script setup></script>

<template>
  <div class="bg-slate-200 h-full py-5">
    <div
      class="container max-w-screen-md mx-auto rounded-md border border-slate-300 bg-white p-10"
    >
      <h1 class="text-xl mb-2 font-semibold">Range Simplifier</h1>
      <p class="text-base">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga maxime
        non tempore, natus maiores eum id ullam incidunt mollitia deleniti
        repudiandae esse est fugiat ab, nemo aliquid sit dolorum. Atque?
      </p>
      <div class="mt-5">
        <div>
          <label
            for="raising_range"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Raising Range</label
          >
          <input
            type="text"
            id="raising_range"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Paste raising range here..."
            required
          />
        </div>
        <div>
          <label
            for="calling_range"
            class="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white"
            >Calling Range</label
          >
          <input
            type="text"
            id="calling_range"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Paste calling range here..."
            required
          />
        </div>
      </div>
    </div>
  </div>
</template>
