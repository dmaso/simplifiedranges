<script setup>
import { ref, onMounted, watch, computed, reactive } from "vue";
</script>
<template>
  <Header />
  <div class="bg-slate-200 h-full py-0 h-screen">
    <div
      class="container max-w-screen-md mx-auto rounded-md border border-slate-300 bg-white p-10"
    >
      <h1 class="text-xl mb-2 font-medium">Range Simplifier</h1>
      <p class="text-base">
        This tool simplifies ranges by converting all mixed frequency actions
        into pure strategies while maintaing the overall frequencies. Simply
        paste a raise and / or call range from GTO Wizard and click simplify.
      </p>

      <div class="flex flex-row space-x-6 mt-5">
        <div class="basis-1/2">
          <div>
            <label
              for="raising_range"
              class="block mb-2 text-base font-medium text-gray-900 dark:text-white"
              >Raising Range ({{ averageRaise }}%)</label
            >
            <input
              type="text"
              id="raising_range"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Paste raising range here..."
              required
              v-model="raisingRangeRaw"
            />
          </div>
        </div>
        <div class="basis-1/2">
          <div>
            <label
              for="calling_range"
              class="block mb-2 text-base font-medium text-gray-900 dark:text-white"
              >Calling Range ({{ averageCall }}%)</label
            >
            <input
              type="text"
              id="calling_range"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Paste calling range here..."
              required
              v-model="callingRangeRaw"
            />
          </div>
        </div>
      </div>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
        @click="simplifyRange"
      >
        Simplify Range
      </button>

      <div
        class="flex space-x-4 mt-5"
        v-if="
          simplifiedRangeSummary.value &&
          Object.keys(simplifiedRangeSummary.value).length > 0
        "
      >
        <div>
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
        </div>
        <div class="grow flex flex-col justify-between">
          <div>
            <button
              class="text-white py-2 px-4 rounded w-full"
              :class="{
                'bg-slate-700': rangeView === 'simplified',
                'bg-slate-400': rangeView !== 'simplified',
              }"
              @click="setRange('simplified')"
            >
              Simplified
            </button>

            <button
              class="text-white py-2 px-4 rounded mt-2 w-full"
              :class="{
                'bg-slate-700': rangeView === 'original',
                'bg-slate-400': rangeView !== 'original',
              }"
              @click="setRange('original')"
            >
              Original
            </button>

            <div>
              <div
                class="bg-red-500 w-full p-2 rounded text-white flex justify-between mt-10"
              >
                <div>Raise</div>
                <div v-if="rangeView === 'simplified'">
                  {{ averageRaiseSimplified }}%
                </div>
                <div v-else>{{ averageRaise }}%</div>
              </div>
              <div
                class="bg-green-500 w-full p-2 rounded text-white flex justify-between mt-2"
              >
                <div>Call</div>
                <div v-if="rangeView === 'simplified'">
                  {{ averageCallSimplified }}%
                </div>
                <div v-else>{{ averageCall }}%</div>
              </div>

              <div
                class="bg-blue-500 w-full p-2 rounded text-white flex justify-between mt-2"
              >
                <div>Fold</div>
                <div v-if="rangeView === 'simplified'">
                  {{ averageFoldSimplified }}%
                </div>
                <div v-else>{{ averageFold }}%</div>
              </div>
            </div>
          </div>

          <div>
            <button
              class="text-white py-2 px-4 rounded w-full bg-slate-400 hover:bg-slate-700"
              @click="copyTextToClipboard('raise')"
            >
              Copy Raise
            </button>

            <button
              class="text-white py-2 px-4 rounded w-full bg-slate-400 hover:bg-slate-700 mt-2"
              @click="copyTextToClipboard('call')"
            >
              Copy Call
            </button>
            <button
              class="text-white py-2 px-4 rounded w-full bg-slate-400 hover:bg-slate-700 mt-2"
              @click="copyTextToClipboard('fold')"
            >
              Copy Fold
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    <Toaster position="top-right" />
  </div>
</template>
