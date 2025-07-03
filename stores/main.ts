import { defineStore } from 'pinia';

interface Food {
  id: string;
  name: string; // 注意：原教程这里写的是 'string'，已更正为 string
  tags: string[];
}

interface HistoryItem {
  foodId: string;
  date: string;
}

export const useMainStore = defineStore('main', {
  state: () => ({
    foods: [
      { id: '1', name: '兰州拉面', tags: ['中餐', '快餐', '午餐'] },
      { id: '2', name: '肯德基', tags: ['西餐', '快餐', '晚餐'] },
      { id: '3', name: '麻辣香锅', tags: ['中餐', '辣', '晚餐'] },
      { id: '4', name: '自己做的三明治', tags: ['健康', '早餐', '在家做'] },
    ] as Food[],
    history: [] as HistoryItem[],
  }),

  getters: {
    getFoodById: (state) => {
      return (foodId: string) => state.foods.find(food => food.id === foodId);
    },
  },
  
  actions: {
    addFood(name: string, tags: string) {
      if (!name.trim()) return;
      
      const newFood: Food = {
        id: new Date().getTime().toString(),
        name: name.trim(),
        tags: tags.split(/[,，\s]+/).filter(tag => tag.trim() !== ''),
      };
      this.foods.push(newFood);
    },
    
    deleteFood(foodId: string) {
      this.foods = this.foods.filter(food => food.id !== foodId);
    },

    selectRandomFood() {
      if (this.foods.length === 0) {
        return null;
      }
      
      const randomIndex = Math.floor(Math.random() * this.foods.length);
      const selectedFood = this.foods[randomIndex];
      
      this.history.unshift({
        foodId: selectedFood.id,
        date: new Date().toISOString(),
      });
      
      if (this.history.length > 20) {
        this.history.pop();
      }

      return selectedFood;
    },
  },
});