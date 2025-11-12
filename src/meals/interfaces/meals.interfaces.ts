export interface MealData {
  id: number;
  name: string;
}

export interface ImageData {
  file: string;
  type: string;
}

export interface FetchedMeal {
  meal_id: number;
  meal_type_name: string;
  name: string;
  image: string;
}
