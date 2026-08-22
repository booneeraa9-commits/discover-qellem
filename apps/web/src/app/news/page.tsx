import NewsView from "@/components/NewsView";
import { categoriesFor, cmsToNewsCard } from "@/lib/adapters";
import { getAllNews } from "@/lib/cms";

export default async function NewsPage() {
  const articles = await getAllNews();
  const sorted = [...articles].sort((a, b) =>
    b.published_date.localeCompare(a.published_date),
  );

  return (
    <NewsView
      articles={sorted.map((article) => ({
        ...cmsToNewsCard(article),
        categoryKey: article.category,
      }))}
      categories={categoriesFor(sorted)}
    />
  );
}
