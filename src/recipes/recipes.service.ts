import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { Meal } from '../meals/entities/meal.entity';
import OpenAI from 'openai';

@Injectable()
export class RecipesService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepo: Repository<Recipe>,
    @InjectRepository(Meal)
    private readonly mealsRepo: Repository<Meal>,
  ) {}

  async getOrGenerateRecipe(meal_id: number): Promise<Recipe> {
    let recipe = await this.recipesRepo.findOne({ where: { meal_id } });
    if (recipe) return recipe;

    const meal = await this.mealsRepo.findOne({
      where: { id: meal_id },
      relations: ['ingredients'],
    });
    if (!meal) throw new Error(`Meal with id ${meal_id} not found`);

    const generated = await this.generateRecipe(
      meal.name,
      meal.ingredients?.ingredients ?? [],
    );

    recipe = this.recipesRepo.create({
      meal_id,
      ingredients: generated.ingredients,
      instructions: generated.steps,
    });
    await this.recipesRepo.save(recipe);

    return recipe;
  }

  private async generateRecipe(meal_name: string, ingredients: string[]) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
Jesteś asystentem generującym przepisy kulinarne w oparciu o listę SKŁADNIKÓW
pochodzącą z bazy danych. Z tych danych musisz stworzyć *poprawną listę kulinarną*.

### ZASADY:

1. ZWRACASZ TYLKO JSON - bez komentarza, bez tłumaczeń.
2. JSON MA STRUKTURĘ:
{
  "ingredients": [
    { "name": "string", "quantity": "string" }
  ],
  "steps": ["string"]
}

3. Składniki wejściowe mogą być w formie:  
   - "pudding 68% (MLEKO..., kasza..., cukier…)"  
   - "jabłko 24% (jabłko, sok z cytryny)"  
   - "sos 7% (maliny, cukier)"
   Usuń procenty, usuń opis w nawiasach, wyciągnij czyste składniki.

4. MUSISZ dodać realistyczne, konkretne ilości (gramy, sztuki, łyżeczki, ml).
   Przykład: "mąka orkiszowa" → "120 g".

5. Instrukcje mają być krótkie, rzeczowe, krok po kroku.

6. Zawsze generuj przepis zgodny z nazwą dania (meal_name).
      `,
        },
        {
          role: 'user',
          content: `
Wygeneruj przepis.

Nazwa dania: ${meal_name}

Surowe składniki (do przetworzenia):
${JSON.stringify(ingredients)}

ZWRÓĆ TYLKO JSON.
        `,
        },
      ],
    });

    const raw = completion.choices[0].message.content;
    if (!raw) throw new Error('Brak odpowiedzi od OpenAI');

    return JSON.parse(raw);
  }
}
