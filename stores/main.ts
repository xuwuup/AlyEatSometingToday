import { defineStore } from 'pinia';
import initialFoods from '~/assets/data/711_food.json';

interface Food {
  id: string;
  name: string;
  tags: string[];
}

interface HistoryItem {
  foodId: string;
  date: string;
}

export const useMainStore = defineStore('main', {
  state: () => ({
    foods: initialFoods as Food[],
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