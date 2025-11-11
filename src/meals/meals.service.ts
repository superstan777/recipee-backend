import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meal } from './entities/meal.entity';
import { Image } from '../images/entities/image.entity';
import { MealType } from '../meal-type/entities/meal_type.entity';

interface MealData {
  id: number;
  name: string;
}

interface ImageData {
  file: string;
  type: string;
}

@Injectable()
export class MealsService implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Meal) private readonly mealsRepo: Repository<Meal>,
    @InjectRepository(Image) private readonly imagesRepo: Repository<Image>,
    @InjectRepository(MealType)
    private readonly mealTypeRepo: Repository<MealType>,
  ) {}

  // 🔹 Uruchamiane przy starcie aplikacji
  async onModuleInit() {
    console.log('🌱 Fetching meals on app start...');
    try {
      await this.fetchMeals();
      console.log('✅ Meals fetched successfully on app start');
    } catch (err) {
      console.error('❌ Error fetching meals on app start:', err);
    }
  }

  // 🔹 Główna funkcja pobierająca posiłki z API
  async fetchMeals() {
    const today = new Date().toISOString().split('T')[0];
    const url = `https://ntfy.pl/wp-json/dccore/v1/menu-planner?date=${today}&expansions__in=serving_id%2Cserving.multimedia_collection%2Cmeal_type_id%2Cmeal_id%2Cmeal.category_id%2Csize_id&brand_id=11&package_id=20`;

    const response = await firstValueFrom(this.httpService.get(url));
    const data = response.data;
    if (!data?.includes?.meals) return [];

    // Mapy dla szybkiego lookup
    const mealsMap = new Map<number, MealData>(
      data.includes.meals.map((m: MealData) => [m.id, m]),
    );

    const imagesMap = new Map<number, ImageData[]>(
      data.includes.multimedia_collection.map(
        (m: { serving_id: number; images: ImageData[] }) => [
          m.serving_id,
          m.images,
        ],
      ),
    );

    const results = data.results[today]?.map(
      (item: { meal_id: number; meal_type_id: number; serving_id: number }) => {
        const meal = mealsMap.get(item.meal_id);
        const images = imagesMap.get(item.serving_id) || [];
        const verticalImage = images.find(
          (img) => img.type === 'MULTIMEDIA_VERTICAL',
        );
        const mealTypeName = data.includes.meal_types?.find(
          (mt: any) => mt.id === item.meal_type_id,
        )?.name;

        return {
          meal_id: item.meal_id,
          meal_type_name: mealTypeName!,
          name: meal?.name || null,
          image: verticalImage
            ? `https://dccore.ntfy.pl/upload/multimedia/${verticalImage.file}`
            : null,
        };
      },
    );

    if (!results) return [];

    for (const item of results) {
      // Szukamy meal_type po nazwie
      const mealType = await this.mealTypeRepo.findOne({
        where: { name: item.meal_type_name },
      });

      if (!mealType)
        throw new Error(`MealType not found in DB: ${item.meal_type_name}`);

      // Sprawdzamy, czy już istnieje meal o tym meal_id
      const existingMeal = await this.mealsRepo.findOne({
        where: { meal_id: item.meal_id },
      });

      if (!existingMeal) {
        const newMeal = this.mealsRepo.create({
          meal_id: item.meal_id,
          name: item.name,
          meal_type_id: mealType.id,
          meal_type: mealType,
        });

        await this.mealsRepo.save(newMeal);

        if (item.image) {
          const newImage = this.imagesRepo.create({
            url: item.image,
            meal: newMeal,
          });
          await this.imagesRepo.save(newImage);
        }
      }
    }

    return results;
  }
}
