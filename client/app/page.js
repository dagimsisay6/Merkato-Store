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
import {
  getProducts,
  getCategories,
  getBrands,
  getCountries,
} from "@/lib/api";

export default async function Home() {
  const [productsData, categoriesData, brandsData, countriesData] = await Promise.all([
    getProducts({ page: 1 }),
    getCategories(),
    getBrands(),
    getCountries(),
  ]);

  const products = productsData?.products ?? [];
  const categories = categoriesData?.categories ?? [];
  const brands = brandsData?.brands ?? [];
  const countries = countriesData?.countries ?? [];

  return (
    <div>
      <Hero />
      <TrustTicker />
      <Categories categories={categories} />
      <FlashSales products={products.slice(0, 4)} />
      <Featured products={products} />
      <ShopByCountry countries={countries} />
      <BestSellers products={products.slice(0, 4)} />
      <NewArrivals products={products.slice(2, 6)} />
      <WhyChoose />
      <Brands brands={brands} />
      <Testimonials />
      <AppPromo />
      <Newsletter />
    </div>
  );
}
