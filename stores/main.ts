import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export interface Food {
  id: string;
  name: string;
  description?: string;
}




function getLocalFoods(filename: string): Food[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('foods_' + filename);
    if (data) return JSON.parse(data);
  }
  return [];
}

function setLocalFoods(filename: string, foods: Food[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('foods_' + filename, JSON.stringify(foods));
  }
}

export const useMainStore = defineStore('main', () => {
  // 当前菜单 foods
  const foods = ref<Food[]>([]);
  let currentMenuFile = ref<string>('');

  async function loadFoodsFromFile(filename: string) {
    currentMenuFile.value = filename;
    // 优先从 localStorage 读取 foods_文件名
    let localFoods = getLocalFoods(filename);
    if (Array.isArray(localFoods) && localFoods.length > 0) {
      foods.value = localFoods;
      return;
    }
    // localStorage 为空或空数组时，加载 json 文件并写入 localStorage
    try {
      // Vite 动态 import 变量必须带文件后缀且不能有 ~，需用 import.meta.glob
      const modules = import.meta.glob('/assets/data/*.json');
      const filePath = `/assets/data/${filename}`;
      if (!modules[filePath]) {
        foods.value = [];
        return;
      }
      const mod: any = await modules[filePath]();
      let foodsArr: Food[] = [];
      if (Array.isArray(mod.default)) {
        foodsArr = mod.default;
      } else if (mod.default && Array.isArray(mod.default._data)) {
        foodsArr = mod.default._data;
      }
      setLocalFoods(filename, foodsArr);
      foods.value = foodsArr;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('加载食物数据失败:', e);
      foods.value = [];
    }
  }

  function addFood(name: string, description?: string) {
    if (!name.trim()) return;
    const newFood: Food = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description?.trim() || undefined,
    };
    foods.value.push(newFood);
    setLocalFoods(currentMenuFile.value, foods.value);
  }

  function deleteFood(foodId: string) {
    foods.value = foods.value.filter(food => food.id !== foodId);
    setLocalFoods(currentMenuFile.value, foods.value);
  }

  function selectRandomFood() {
    if (foods.value.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * foods.value.length);
    return foods.value[randomIndex];
  }

  function getFoodById(foodId: string) {
    return foods.value.find(food => food.id === foodId);
  }

  // 保证 foods 响应式持久化
  watch(foods, (val) => setLocalFoods(currentMenuFile.value, val), { deep: true });

  return {
    foods,
    addFood,
    deleteFood,
    loadFoodsFromFile,
    selectRandomFood,
    getFoodById,
  };
});