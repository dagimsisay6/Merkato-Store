import { Hero } from "@/components/store/Hero";
import { Newsletter } from "@/components/store/Newsletter";
import { TrustTicker } from "@/components/home/TrustTicker";
import { Categories } from "@/components/home/Categories";
import { FlashSales } from "@/components/home/FlashSales";
import { Featured } from "@/components/home/Featured";
import { ShopByCountry } from "@/components/home/ShopByCountry";
import { BestSellers } from "@/components/home/BestSellers";
import { NewArrivals } from "@/components/home/NewArrivals";
import { WhyChoose } from "@/components/home/WhyChoose";
import { Brands } from "@/components/home/Brands";
import { Testimonials } from "@/components/home/Testimonials";
import { AppPromo } from "@/components/home/AppPromo";

export default function Home() {
  return (
    <div>
      <Hero />
      <TrustTicker />
      <Categories />
      <FlashSales />
      <Featured />
      <ShopByCountry />
      <BestSellers />
      <NewArrivals />
      <WhyChoose />
      <Brands />
      <Testimonials />
      <AppPromo />
      <Newsletter />
    </div>
  );
}
