import { dataSource } from '../database/data-source';
import { SidebarTag } from 'src/sidebar-tags/entities/sidebar_tag.entity';

export async function seedSidebarTags() {
  await dataSource.initialize();
  const repo = dataSource.getRepository(SidebarTag);

  // każdy meal_type_id odpowiada posiłkowi, dodajemy po 2 tagi
  const initialTags = [
    { meal_type_id: 1, tag_name: 'Slodkie' },
    { meal_type_id: 1, tag_name: 'Wytrawne' },
    { meal_type_id: 2, tag_name: 'Owocowe' },
    { meal_type_id: 2, tag_name: 'Bialkowe' },
    { meal_type_id: 3, tag_name: 'Wegetarianskie' },
    { meal_type_id: 3, tag_name: 'Miesne' },
    { meal_type_id: 4, tag_name: 'Slodkie' },
    { meal_type_id: 4, tag_name: 'Wytrawne' },
    { meal_type_id: 5, tag_name: 'Miesne' },
    { meal_type_id: 5, tag_name: 'Wegetarianskie' },
    { meal_type_id: 6, tag_name: 'Przekaski slodkie' },
    { meal_type_id: 6, tag_name: 'Przekaski slone' },
  ];

  for (const tag of initialTags) {
    const exists = await repo.findOne({
      where: { meal_type_id: tag.meal_type_id, tag_name: tag.tag_name },
    });
    if (!exists) {
      await repo.save(repo.create(tag));
    }
  }

  await dataSource.destroy();
  console.log('Sidebar tags seeded!');
}

// Uruchamianie z terminala
if (require.main === module) {
  seedSidebarTags()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
