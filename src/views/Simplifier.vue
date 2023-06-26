<script setup>
import { ref, onMounted, watch, computed } from "vue";

let raisingRangeRaw = ref("");
let callingRangeRaw = ref("");

let inputRangeFull = ref({});

let averageRaise = ref(0);
let averageCall = ref(0);
let averageFold = ref(0);

function orderCards(hand) {
  const rankOrder = "AKQJT98765432";
  const card1 = hand.substring(0, 2);
  const card2 = hand.substring(2, 4);

  // Get ranks of the cards
  const rank1 = card1.charAt(0);
  const rank2 = card2.charAt(0);

  // Compare the ranks of the cards
  const rank1Index = rankOrder.indexOf(rank1);
  const rank2Index = rankOrder.indexOf(rank2);

  // If rank1 has a higher rank (i.e., a lower index), put it first
  const orderedHand = rank1Index <= rank2Index ? card1 + card2 : card2 + card1;

  return orderedHand;
}

watch(raisingRangeRaw, (newVal) => {
  // Parse new value
  const handData = newVal.split(",").map((entry) => {
    const [hand, raiseFreq] = entry.split(":");
    return { hand: orderCards(hand), raiseFreq: parseFloat(raiseFreq) };
  });

  // Update inputRangeFull with parsed data
  for (const data of handData) {
    if (inputRangeFull.value.hasOwnProperty(data.hand)) {
      inputRangeFull.value[data.hand].raise = data.raiseFreq;
    } else {
      const reversedHand =
        data.hand.substring(2, 4) + data.hand.substring(0, 2);

      if (inputRangeFull.value.hasOwnProperty(reversedHand)) {
        inputRangeFull.value[reversedHand].raise = data.raiseFreq;
      } else {
        console.error(`Could not find hand ${data.hand} in inputRangeFull`);
      }
    }
  }

  // Recalculate average
  const values = Object.values(inputRangeFull.value);
  const totalRaise = values.reduce((total, hand) => total + hand.raise, 0);
  averageRaise.value = ((totalRaise / values.length) * 100).toFixed(1);

  // Fold frequency calculation
  for (const hand in inputRangeFull.value) {
    if (inputRangeFull.value.hasOwnProperty(hand)) {
      const total =
        inputRangeFull.value[hand].raise + inputRangeFull.value[hand].call;
      inputRangeFull.value[hand].fold = ((1 - total) * 100).toFixed(1);
    }
  }
});

watch(callingRangeRaw, (newVal) => {
  // Parse new value
  const handData = newVal.split(",").map((entry) => {
    const [hand, callFreq] = entry.split(":");
    return { hand: orderCards(hand), callFreq: parseFloat(callFreq) };
  });

  // Update inputRangeFull with parsed data
  for (const data of handData) {
    if (inputRangeFull.value.hasOwnProperty(data.hand)) {
      inputRangeFull.value[data.hand].call = data.callFreq;
    } else {
      const reversedHand =
        data.hand.substring(2, 4) + data.hand.substring(0, 2);

      if (inputRangeFull.value.hasOwnProperty(reversedHand)) {
        inputRangeFull.value[reversedHand].call = data.callFreq;
      } else {
        console.error(`Could not find hand ${data.hand} in inputRangeFull`);
      }
    }
  }

  // Recalculate average
  const values = Object.values(inputRangeFull.value);
  const totalCall = values.reduce((total, hand) => total + hand.call, 0);
  averageCall.value = ((totalCall / values.length) * 100).toFixed(1);

  // Fold frequency calculation
  for (const hand in inputRangeFull.value) {
    if (inputRangeFull.value.hasOwnProperty(hand)) {
      const total =
        inputRangeFull.value[hand].raise + inputRangeFull.value[hand].call;
      inputRangeFull.value[hand].fold = ((1 - total) * 100).toFixed(1);
    }
  }
});

onMounted(() => {
  const suits = ["h", "d", "c", "s"];
  const values = [
    "A",
    "K",
    "Q",
    "J",
    "T",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
  ];

  const deck = [];

  // Generate all cards
  for (let s = 0; s < suits.length; s++) {
    for (let v = 0; v < values.length; v++) {
      deck.push(values[v] + suits[s]);
    }
  }

  // Generate all combinations
  for (let i = 0; i < deck.length; i++) {
    for (let j = i + 1; j < deck.length; j++) {
      // Using a template string for card combination as key
      let handKey = `${deck[i]}${deck[j]}`;
      handKey = orderCards(handKey);
      inputRangeFull.value[handKey] = {
        raise: 0,
        call: 0,
        fold: 0,
      };
    }
  }
});
</script>

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
        <div>
          <label
            for="calling_range"
            class="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white"
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
      <div class="mt-5">
        <p>Folding Range ({{ 100 - averageCall - averageRaise }}%)</p>

        <table
          class="border-collapse w-full border border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 text-sm shadow-sm"
        >
          <thead class="bg-slate-50 dark:bg-slate-700">
            <tr>
              <th
                class="border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left"
              >
                Hand
              </th>
              <th
                class="border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left"
              >
                Raise
              </th>
              <th
                class="border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left"
              >
                Call
              </th>
              <th
                class="border border-slate-300 dark:border-slate-600 font-semibold p-4 text-slate-900 dark:text-slate-200 text-left"
              >
                Fold
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hand in Object.keys(inputRangeFull)" :key="hand">
              <td
                class="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400"
              >
                {{ hand }}
              </td>
              <td
                class="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400"
              >
                {{ inputRangeFull[hand].raise }}
              </td>
              <td
                class="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400"
              >
                {{ inputRangeFull[hand].call }}
              </td>
              <td
                class="border border-slate-300 dark:border-slate-700 p-4 text-slate-500 dark:text-slate-400"
              >
                {{ inputRangeFull[hand].fold }}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="2">Average Raise</th>
              <td></td>
            </tr>
          </tfoot>
        </table>
        <p class="text-sm mt-4">
          Count of hands: {{ Object.keys(inputRangeFull).length }}
        </p>
      </div>
    </div>
  </div>
</template>
