<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">我的食物清单</h1>

    <!-- 添加新食物的表单 -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">添加新食物</h2>
      <form @submit.prevent="handleAddFood" class="flex flex-col sm:flex-row gap-4">
        <input 
          v-model="newFoodName" 
          type="text" 
          placeholder="食物名称 (如: 黄焖鸡米饭)" 
          class="flex-grow p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
        <input 
          v-model="newFoodTags" 
          type="text" 
          placeholder="标签 (用逗号或空格隔开)" 
          class="flex-grow p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
        <button 
          type="submit" 
          class="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
        >
          添加
        </button>
      </form>
    </div>

    <!-- 食物列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="food in mainStore.foods" 
        :key="food.id"
        class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center"
      >
        <div>
          <h3 class="font-bold">{{ food.name }}</h3>
          <div class="flex flex-wrap gap-1 mt-2">
            <span v-for="tag in food.tags" :key="tag" class="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
              {{ tag }}
            </span>
          </div>
        </div>
        <button @click="mainStore.deleteFood(food.id)" class="text-red-500 hover:text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <div v-if="mainStore.foods.length === 0" class="text-center text-gray-500 py-10">
      你的清单是空的，快添加一些你爱吃的吧！
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMainStore } from '~/stores/main';

const mainStore = useMainStore();

const newFoodName = ref('');
const newFoodTags = ref('');

function handleAddFood() {
  mainStore.addFood(newFoodName.value, newFoodTags.value);
  // 清空输入框
  newFoodName.value = '';
  newFoodTags.value = '';
}
</script>