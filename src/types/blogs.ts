export interface NewsArticle {
  author: string | null;
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  content: string;
  source: {
    url: string | null;
    name: string;
  };
}
