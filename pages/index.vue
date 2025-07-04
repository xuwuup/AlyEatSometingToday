<template>
  <div class="text-center py-16">
    <h1 class="text-4xl font-bold mb-4">今天吃什么？</h1>
    <p class="text-gray-600 dark:text-gray-400 mb-8">点击下面的按钮，然后再决定吧！</p>
    <p class="text-gray-600 dark:text-gray-400 mb-8">注意：阿黄对结果概不负责（诶嘿）</p>

    <!-- 动态菜单下拉列表 -->
    <div class="mb-8 flex items-center justify-center gap-4">
      <label class="font-semibold">你选择的菜单是：</label>
      <select v-model="selectedFile" @change="handleFileChange" class="p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
        <option v-for="file in jsonFiles" :key="file.value" :value="file.value">{{ file.label }}</option>
      </select>
    </div>

    <div class="my-10">
  <button 
    @click="makeDecision" 
    :disabled="loading || mainStore.foods.length === 0"
    class="bg-green-600 text-white font-bold py-4 px-8 rounded-full text-2xl transform hover:scale-105 transition-transform duration-300 shadow-lg"
    :class="{ 'opacity-50 cursor-not-allowed': loading || mainStore.foods.length === 0 }"
  >
    {{ loading ? '菜单加载中...' : '开始！' }}
  </button>
</div>

    <!-- 抽取结果弹窗（无黑色遮罩，带动画） -->
    <transition name="fade">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <transition name="pop">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-xs w-full relative pointer-events-auto animate-bounce-in">
            <button @click="closeModal" class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold">×</button>
            <h2 class="text-xl font-bold mb-4 text-center animate-fade-in">就吃这个了！</h2>
            <div class="text-center">
              <div class="text-4xl font-extrabold text-green-500 mb-2 animate-pop-in">{{ result?.name }}</div>
              <div v-if="result?.description" class="text-gray-600 dark:text-gray-300 text-base animate-fade-in">{{ result.description }}</div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s cubic-bezier(.4,0,.2,1);
}
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-enter-to, .fade-leave-from { opacity: 1; }
.pop-enter-active { animation: pop-in 0.35s cubic-bezier(.4,0,.2,1); }
@keyframes pop-in {
  0% { transform: scale(0.7) translateY(40px); opacity: 0; }
  80% { transform: scale(1.05) translateY(-8px); opacity: 1; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}
.animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(.4,0,.2,1); }
@keyframes bounce-in {
  0% { transform: scale(0.7); opacity: 0; }
  60% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-pop-in { animation: pop-in 0.4s cubic-bezier(.4,0,.2,1); }
.animate-fade-in { animation: fade-in 0.5s cubic-bezier(.4,0,.2,1); }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { useMainStore } from '~/stores/main';

const mainStore = useMainStore();
const result = ref(null);
const showModal = ref(false);
const selectedFile = ref('');
const jsonFiles = ref([]);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  const modules = import.meta.glob('~/assets/data/*.json');
  const files = Object.keys(modules);
  const fileInfos = await Promise.all(files.map(async (path) => {
    const mod = await modules[path]();
    let label = '';
    if (mod.default && mod.default._label) {
      label = mod.default._label;
    } else if (mod._label) {
      label = mod._label;
    } else {
      label = path.split('/').pop().replace('.json', '');
    }
    return {
      value: path.split('/').pop(),
      label,
    };
  }));
  jsonFiles.value = fileInfos;
  if (jsonFiles.value.length > 0) {
    selectedFile.value = jsonFiles.value[0].value;
    await mainStore.loadFoodsFromFile(selectedFile.value);
  }
  loading.value = false;
});

async function handleFileChange() {
  loading.value = true;
  await mainStore.loadFoodsFromFile(selectedFile.value);
  loading.value = false;
}

function makeDecision() {
  if (loading.value) return;
  const selectedFood = mainStore.selectRandomFood();
  if (selectedFood) {
    result.value = selectedFood;
    showModal.value = true;
  } else {
    alert('你的食物清单是空的，快去“我的食物”页面添加一些吧！');
  }
}

function closeModal() {
  showModal.value = false;
}
</script>