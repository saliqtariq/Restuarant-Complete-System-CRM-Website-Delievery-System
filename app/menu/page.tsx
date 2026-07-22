import MenuCategoryList from "@/components/menu/MenuCategoryList";

export const metadata = {
  title: "Menu | Abraham's Table",
  description: "Explore our delicious menu items.",
};

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-gray-50/30 font-sans text-gray-900 flex flex-col">
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 pt-4 pb-12">
        <MenuCategoryList />
      </div>
    </main>
  );
}
