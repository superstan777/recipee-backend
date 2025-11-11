import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface Serving {
  id: number;
  name: string;
}

interface Image {
  file: string;
  type: string;
}

@Injectable()
export class MealsService {
  constructor(private readonly httpService: HttpService) {}

  async fetchMeals() {
    // Pobieramy aktualną datę w formacie YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    const url = `https://ntfy.pl/wp-json/dccore/v1/menu-planner?date=${today}&expansions__in=serving_id%2Cserving.multimedia_collection%2Cmeal_type_id%2Cmeal_id%2Cmeal.category_id%2Csize_id&brand_id=11&package_id=20`;

    const response = await firstValueFrom(
      this.httpService.get(url, {
        headers: {
          accept: '*/*',
          'content-type': 'application/json',
        },
      }),
    );

    const data = response.data;

    const servingsMap = new Map<number, Serving>(
      data.includes.servings.map((s: Serving) => [s.id, s]),
    );

    const imagesMap = new Map<number, Image[]>(
      data.includes.multimedia_collection.map(
        (m: { serving_id: number; images: Image[] }) => [
          m.serving_id,
          m.images,
        ],
      ),
    );

    const result = data.results[today]?.map(
      (item: { serving_id: number; meal_type_id: number }) => {
        const serving = servingsMap.get(item.serving_id);
        const images = imagesMap.get(item.serving_id) || [];

        // Filtrujemy tylko MULTIMEDIA_VERTICAL i bierzemy pierwszy pasujący
        const verticalImage = images.find(
          (img) => img.type === 'MULTIMEDIA_VERTICAL',
        );

        const meal_type = data.includes.meal_types?.find(
          (mt: any) => mt.id === item.meal_type_id,
        )?.name;

        return {
          serving_id: item.serving_id, // <- dodane
          meal_type: meal_type || null,
          name: serving?.name || null,
          image: verticalImage
            ? `https://dccore.ntfy.pl/upload/multimedia/${verticalImage.file}`
            : null,
        };
      },
    );

    return result || [];
  }
}
