import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import CategorySection from "@/components/home/CategorySection";
import PopularDestinations from "@/components/home/PopularDestinations";
import SeasonTips from "@/components/home/SeasonTips";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <CategorySection />
      <PopularDestinations />
      <SeasonTips />
    </Layout>
  );
};

export default Index;
