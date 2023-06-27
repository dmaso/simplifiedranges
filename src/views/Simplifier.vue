<script setup>
import { ref, onMounted, watch, computed, reactive } from "vue";
import Header from "@/components/Header.vue";

let raisingRangeRaw = ref("");
let callingRangeRaw = ref("");

let inputRangeFull = ref({});
let simplifiedRangeFull = reactive({});
let simplifiedRangeSummary = reactive({});
let originalRangeSummary = reactive({});

let averageRaise = ref(0);
let averageCall = ref(0);
const averageFold = computed(() => {
  const fold = 100 - averageRaise.value - averageCall.value;
  return fold.toFixed(2);
});

let averageRaiseSimplified = ref(0);
let averageCallSimplified = ref(0);
let averageFoldSimplified = ref(0);
const handClasses = [
  "AA",
  "AKs",
  "AQs",
  "AJs",
  "ATs",
  "A9s",
  "A8s",
  "A7s",
  "A6s",
  "A5s",
  "A4s",
  "A3s",
  "A2s",
  "AKo",
  "KK",
  "KQs",
  "KJs",
  "KTs",
  "K9s",
  "K8s",
  "K7s",
  "K6s",
  "K5s",
  "K4s",
  "K3s",
  "K2s",
  "AQo",
  "KQo",
  "QQ",
  "QJs",
  "QTs",
  "Q9s",
  "Q8s",
  "Q7s",
  "Q6s",
  "Q5s",
  "Q4s",
  "Q3s",
  "Q2s",
  "AJo",
  "KJo",
  "QJo",
  "JJ",
  "JTs",
  "J9s",
  "J8s",
  "J7s",
  "J6s",
  "J5s",
  "J4s",
  "J3s",
  "J2s",
  "ATo",
  "KTo",
  "QTo",
  "JTo",
  "TT",
  "T9s",
  "T8s",
  "T7s",
  "T6s",
  "T5s",
  "T4s",
  "T3s",
  "T2s",
  "A9o",
  "K9o",
  "Q9o",
  "J9o",
  "T9o",
  "99",
  "98s",
  "97s",
  "96s",
  "95s",
  "94s",
  "93s",
  "92s",
  "A8o",
  "K8o",
  "Q8o",
  "J8o",
  "T8o",
  "98o",
  "88",
  "87s",
  "86s",
  "85s",
  "84s",
  "83s",
  "82s",
  "A7o",
  "K7o",
  "Q7o",
  "J7o",
  "T7o",
  "97o",
  "87o",
  "77",
  "76s",
  "75s",
  "74s",
  "73s",
  "72s",
  "A6o",
  "K6o",
  "Q6o",
  "J6o",
  "T6o",
  "96o",
  "86o",
  "76o",
  "66",
  "65s",
  "64s",
  "63s",
  "62s",
  "A5o",
  "K5o",
  "Q5o",
  "J5o",
  "T5o",
  "95o",
  "85o",
  "75o",
  "65o",
  "55",
  "54s",
  "53s",
  "52s",
  "A4o",
  "K4o",
  "Q4o",
  "J4o",
  "T4o",
  "94o",
  "84o",
  "74o",
  "64o",
  "54o",
  "44",
  "43s",
  "42s",
  "A3o",
  "K3o",
  "Q3o",
  "J3o",
  "T3o",
  "93o",
  "83o",
  "73o",
  "63o",
  "53o",
  "43o",
  "33",
  "32s",
  "A2o",
  "K2o",
  "Q2o",
  "J2o",
  "T2o",
  "92o",
  "82o",
  "72o",
  "62o",
  "52o",
  "42o",
  "32o",
  "22",
];

let rangeView = ref("simplified");

const setRange = (newRange) => {
  rangeView.value = newRange;
};

function createGradientStyle(handClassData) {
  let redEnd, greenStart, greenEnd, blueStart, blueEnd;
  console.log(rangeView.value);
  console.log("Range range range");

  if (rangeView.value === "simplified") {
    redEnd = handClassData.raise * 100;
    greenStart = redEnd;
    greenEnd = greenStart + handClassData.call * 100;
    blueStart = greenEnd;
    blueEnd = blueStart + handClassData.fold * 100;
  } else if (rangeView.value === "original") {
    redEnd = handClassData.raise * 100;
    greenStart = redEnd;
    greenEnd = greenStart + handClassData.call * 100;
    blueStart = greenEnd;
    blueEnd = 100;
  } else {
    // Handle invalid range value here
    console.error("Invalid range value: ", range);
    return ""; // Return an empty style if the range is invalid
  }

  return `background-image:
    linear-gradient(to right, rgb(240, 60, 60) ${redEnd}%, transparent ${redEnd}%),
    linear-gradient(to right, rgb(90, 185, 102) ${greenEnd}%, transparent ${greenEnd}%),
    linear-gradient(to right, rgb(61, 124, 184) ${blueEnd}%, transparent ${blueEnd}%);
    background-size: 100%, 100%, 100%;
    background-repeat: no-repeat;`;
}

function calculateSummary(newRanges) {
  let summary = {};

  let totalRaise = 0;
  let totalCall = 0;
  let totalFold = 0;
  let totalCount = 0;

  Object.keys(newRanges).forEach((key) => {
    let hand;
    let suffix = ""; // new variable for the suffix
    const card1 = key.slice(0, 2);
    const card2 = key.slice(2, 4);

    // Check if the cards are a pair
    if (card1[0] === card2[0]) {
      hand = `${card1[0]}${card2[0]}`;
    } else if (card1[1] === card2[1]) {
      // Check if the cards are suited
      hand = `${card1[0]}${card2[0]}`;
      suffix = "s"; // assign the suffix here
    } else {
      // The cards are offsuit
      hand = `${card1[0]}${card2[0]}`;
      suffix = "o"; // assign the suffix here
    }

    // Order the cards
    hand = orderCards(hand) + suffix; // add the suffix here

    if (!(hand in summary)) {
      summary[hand] = {
        raise: 0,
        call: 0,
        fold: 0,
        count: 0,
      };
    }

    summary[hand].raise += newRanges[key].raise;
    summary[hand].call += newRanges[key].call;
    summary[hand].fold += newRanges[key].fold;
    summary[hand].count++;

    // Update total counts for raise, call, and fold
    totalRaise += newRanges[key].raise * summary[hand].count;
    totalCall += newRanges[key].call * summary[hand].count;
    totalFold += newRanges[key].fold * summary[hand].count;
    totalCount += summary[hand].count;
  });

  // Now average the frequencies
  for (const hand in summary) {
    summary[hand].raise /= summary[hand].count;
    summary[hand].call /= summary[hand].count;
    summary[hand].fold /= summary[hand].count;
  }

  simplifiedRangeSummary.value = summary;
}

function calculateSummaryOriginal(newRanges) {
  let summary = {};

  let totalRaise = 0;
  let totalCall = 0;
  let totalCount = 0;

  Object.keys(newRanges).forEach((key) => {
    let hand;
    let suffix = ""; // new variable for the suffix
    const card1 = key.slice(0, 2);
    const card2 = key.slice(2, 4);

    // Check if the cards are a pair
    if (card1[0] === card2[0]) {
      hand = `${card1[0]}${card2[0]}`;
    } else if (card1[1] === card2[1]) {
      // Check if the cards are suited
      hand = `${card1[0]}${card2[0]}`;
      suffix = "s"; // assign the suffix here
    } else {
      // The cards are offsuit
      hand = `${card1[0]}${card2[0]}`;
      suffix = "o"; // assign the suffix here
    }

    // Order the cards
    hand = orderCards(hand) + suffix; // add the suffix here

    if (!(hand in summary)) {
      summary[hand] = {
        raise: 0,
        call: 0,
        fold: 0,
        count: 0,
      };
    }

    summary[hand].raise += newRanges[key].raise;
    summary[hand].call += newRanges[key].call;
    summary[hand].fold += newRanges[key].fold;
    summary[hand].count++;

    // Update total counts for raise, call, and fold
    totalRaise += newRanges[key].raise * summary[hand].count;
    totalCall += newRanges[key].call * summary[hand].count;
    totalCount += summary[hand].count;
  });

  // Calculate totalFold
  const totalFold = totalCount - totalRaise - totalCall;

  // Set fold as 1 minus call minus raise for each hand
  for (const hand in summary) {
    summary[hand].raise /= summary[hand].count;
    summary[hand].call /= summary[hand].count;
    summary[hand].fold = 1 - summary[hand].call - summary[hand].raise;
  }

  originalRangeSummary.value = summary;
}

function getRangeSummary(handClass) {
  if (rangeView.value === "simplified") {
    return simplifiedRangeSummary.value[handClass];
  } else if (rangeView.value === "original") {
    return originalRangeSummary.value[handClass];
  } else {
    // Handle invalid range value here
    console.error("Invalid range value: ", rangeView.value);
    return {}; // Return an empty object if the range is invalid
  }
}

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

function simplifyRange() {
  // Create a deep copy of the original inputRangeFull
  const newRanges = JSON.parse(JSON.stringify(inputRangeFull.value));
  calculateSummaryOriginal(newRanges);

  let sumRaiseFrequencies = 0;
  let sumCallFrequencies = 0;

  let mixedRaises = [];
  let mixedCalls = [];

  for (let hand in newRanges) {
    if (newRanges.hasOwnProperty(hand)) {
      let raiseFrequency = newRanges[hand].raise;
      let callFrequency = newRanges[hand].call;

      // Sum the values of all "raise" frequencies that are not 0 or 1
      if (raiseFrequency > 0 && raiseFrequency < 1) {
        sumRaiseFrequencies += raiseFrequency;
        mixedRaises.push({ hand: hand, raise: raiseFrequency });
      }

      // Sum all "call" frequencies that are not 0 or 1
      if (callFrequency > 0 && callFrequency < 1) {
        sumCallFrequencies += callFrequency;
        mixedCalls.push({ hand: hand, call: callFrequency });
      }
    }
  }

  // Order the mixedRaises and mixedCalls by highest frequency first
  mixedRaises.sort((a, b) => b.raise - a.raise);
  mixedCalls.sort((a, b) => b.call - a.call);

  // Round down the sumRaiseFrequencies and sumCallFrequencies to nearest whole number
  sumRaiseFrequencies = Math.floor(sumRaiseFrequencies);
  sumCallFrequencies = Math.floor(sumCallFrequencies);

  // Take the first sumRaiseFrequencies entries of mixedRaises and set their raise frequency to 1
  const handsConvertedToOneRaise = [];
  for (let i = 0; i < sumRaiseFrequencies; i++) {
    if (mixedRaises[i]) {
      newRanges[mixedRaises[i].hand].raise = 1;
      newRanges[mixedRaises[i].hand].call = 0; // Set call to 0
      newRanges[mixedRaises[i].hand].fold = 0; // Set fold to 0
      handsConvertedToOneRaise.push(mixedRaises[i].hand);

      // Remove the hand from mixedCalls array
      mixedCalls = mixedCalls.filter(
        (item) => item.hand !== mixedRaises[i].hand
      );
    }
  }

  // Set the raise frequency for all other entries in the mixedRaises array to 0
  for (let i = sumRaiseFrequencies; i < mixedRaises.length; i++) {
    if (mixedRaises[i]) {
      newRanges[mixedRaises[i].hand].raise = 0;
    }
  }

  // Take the first sumCallFrequencies entries of mixedCalls and set their call frequency to 1
  const handsConvertedToOneCall = [];
  for (let i = 0; i < sumCallFrequencies; i++) {
    if (mixedCalls[i]) {
      newRanges[mixedCalls[i].hand].call = 1;
      newRanges[mixedCalls[i].hand].raise = 0; // Set raise to 0
      newRanges[mixedCalls[i].hand].fold = 0; // Set fold to 0
      handsConvertedToOneCall.push(mixedCalls[i].hand);
    }
  }

  // Set the call frequency for all other entries in the mixedCalls array to 0
  for (let i = sumCallFrequencies; i < mixedCalls.length; i++) {
    if (mixedCalls[i]) {
      newRanges[mixedCalls[i].hand].call = 0;
    }
  }

  // Calculate averages
  let totalHands = 0;
  let totalRaise = 0;
  let totalCall = 0;
  for (let hand in newRanges) {
    if (newRanges.hasOwnProperty(hand)) {
      totalHands++;
      totalRaise += newRanges[hand].raise;
      totalCall += newRanges[hand].call;
    }
  }

  averageRaiseSimplified.value = ((totalRaise / totalHands) * 100).toFixed(2);
  averageCallSimplified.value = ((totalCall / totalHands) * 100).toFixed(2);

  // Update fold frequencies and calculate average fold frequency
  let totalFold = 0;
  for (let hand in newRanges) {
    if (newRanges.hasOwnProperty(hand)) {
      newRanges[hand].fold = 1 - (newRanges[hand].raise + newRanges[hand].call);
      totalFold += newRanges[hand].fold;
    }
  }

  averageFoldSimplified.value = ((totalFold / totalHands) * 100).toFixed(2);

  // log hands with raise=1
  let raiseOneHands = [];
  for (let hand in newRanges) {
    if (newRanges.hasOwnProperty(hand)) {
      if (newRanges[hand].raise === 1) {
        raiseOneHands.push(hand);
      }
    }
  }
  calculateSummary(newRanges);
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
  averageRaise.value = ((totalRaise / values.length) * 100).toFixed(2);

  // Fold frequency calculation
  for (const hand in inputRangeFull.value) {
    if (inputRangeFull.value.hasOwnProperty(hand)) {
      const total =
        inputRangeFull.value[hand].raise + inputRangeFull.value[hand].call;
      inputRangeFull.value[hand].fold = (1 - total).toFixed(2);
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
  averageCall.value = ((totalCall / values.length) * 100).toFixed(2);

  // Fold frequency calculation
  for (const hand in inputRangeFull.value) {
    if (inputRangeFull.value.hasOwnProperty(hand)) {
      const total =
        inputRangeFull.value[hand].raise + inputRangeFull.value[hand].call;
      inputRangeFull.value[hand].fold = (1 - total).toFixed(2);
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
        <div class="grow">
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
    </div>
  </div>
</template>
