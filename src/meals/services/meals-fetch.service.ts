import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  FetchedMeal,
  MealData,
  ImageData,
} from '../interfaces/meals.interfaces';

@Injectable()
export class MealsFetchService {
  constructor(private readonly httpService: HttpService) {}

  async fetchMealsFromApi(date: Date): Promise<FetchedMeal[]> {
    const safeDate = date.toISOString().split('T')[0];

    const url = `https://ntfy.pl/wp-json/dccore/v1/menu-planner?date=${safeDate}&expansions__in=serving_id%2Cserving.multimedia_collection%2Cmeal_type_id%2Cmeal_id%2Cmeal.category_id%2Csize_id&brand_id=11&package_id=20`;

    const response = await firstValueFrom(this.httpService.get(url));
    const data = response.data;

    if (!data?.includes?.meals) return [];

    const mealsMap = new Map<number, MealData>(
      data.includes.meals.map((m: MealData) => [m.id, m]),
    );

    const imagesMap = new Map<number, ImageData[]>(
      data.includes.multimedia_collection?.map(
        (m: { serving_id: number; images: ImageData[] }) => [
          m.serving_id,
          m.images,
        ],
      ) ?? [],
    );

    const servingsMap = new Map<number, any[]>();

    if (data.includes.servings) {
      for (const serving of data.includes.servings) {
        if (!servingsMap.has(serving.meal_id)) {
          servingsMap.set(serving.meal_id, []);
        }
        servingsMap.get(serving.meal_id)!.push(serving);
      }
    }

    const results: FetchedMeal[] =
      data.results[safeDate]?.map(
        (item: {
          meal_id: number;
          meal_type_id: number;
          serving_id: number;
        }) => {
          const meal = mealsMap.get(item.meal_id);
          const images = imagesMap.get(item.serving_id) || [];

          const verticalImage = images.find(
            (img) => img.type === 'MULTIMEDIA_VERTICAL',
          );

          const mealTypeName =
            data.includes.meal_types?.find(
              (mt: any) => mt.id === item.meal_type_id,
            )?.name || null;

          const allServings = servingsMap.get(item.meal_id) || [];
          const firstServing = allServings[0] || null;

          return {
            meal_id: item.meal_id,
            meal_type_name: mealTypeName,
            name: meal?.name || null,

            image: verticalImage
              ? `https://dccore.ntfy.pl/upload/multimedia/${verticalImage.file}`
              : null,

            ingredients_id: firstServing?.crc32_hash,
          };
        },
      ) ?? [];

    return results;
  }
}
