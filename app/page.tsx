import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { FlashSale } from "@/components/home/FlashSale";
import { FeatureBar } from "@/components/home/FeatureBar";
import { ReviewSection } from "@/components/home/ReviewSection";

export default function HomePage() {
  return (
    <div className="bg-[#0F0A1E]">
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <FlashSale />
      <FeatureBar />
      <ReviewSection />
    </div>
  );
}
