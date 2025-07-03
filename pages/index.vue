<template>
  <div class="text-center py-16">
    <h1 class="text-4xl font-bold mb-4">今天吃什么？</h1>
    <p class="text-gray-600 dark:text-gray-400 mb-8">点击下面的按钮，然后再决定吧！</p>
    <p class="text-gray-600 dark:text-gray-400 mb-8">注意：阿黄对结果概不负责（诶嘿）</p>
    
    <div class="my-10">
      <button 
        @click="makeDecision" 
        class="bg-green-600 text-white font-bold py-4 px-8 rounded-full text-2xl transform hover:scale-105 transition-transform duration-300 shadow-lg"
      >
        开始！
      </button>
    </div>
    
    <!-- 结果展示区域 -->
    <div v-if="result" class="mt-12 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md mx-auto">
      <h2 class="text-2xl font-semibold mb-2">就吃这个了！</h2>
      <p class="text-5xl font-extrabold text-green-500">{{ result.name }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMainStore } from '~/stores/main';

const mainStore = useMainStore();
const result = ref(null);

function makeDecision() {
  // 调用 store 中的 action
  const selectedFood = mainStore.selectRandomFood();
  if (selectedFood) {
    result.value = selectedFood;
  } else {
    alert('你的食物清单是空的，快去“我的食物”页面添加一些吧！');
  }
}
</script>