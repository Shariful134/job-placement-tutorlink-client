import CategoryTutor from "@/components/modules/tutor/CategoryTutor";

const CategoryPage = async ({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) => {
  const { categoryId } = await params;

  return (
    <div>
      <CategoryTutor categoryId={categoryId}></CategoryTutor>
    </div>
  );
};

export default CategoryPage;
