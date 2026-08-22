import NewsView from "@/components/NewsView";
import { categoriesFor, cmsToNewsCard } from "@/lib/adapters";
import { getAllImageRenditions, getAllNews } from "@/lib/cms";

export default async function NewsPage() {
  const [articles, imagesById] = await Promise.all([
    getAllNews(),
    getAllImageRenditions(),
  ]);
  const sorted = [...articles].sort((a, b) =>
    b.published_date.localeCompare(a.published_date),
  );

  return (
    <NewsView
      articles={sorted.map((article) => ({
        ...cmsToNewsCard(article, imagesById),
        categoryKey: article.category,
      }))}
      categories={categoriesFor(sorted)}
    />
  );
}
