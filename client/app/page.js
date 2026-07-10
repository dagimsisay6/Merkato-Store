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
  console.log("[HOME] Fetching from API:", process.env.NEXT_PUBLIC_API_URL);
  const [productsData, categoriesData, brandsData, countriesData] = await Promise.allSettled([
    getProducts({ page: 1 }),
    getCategories(),
    getBrands(),
    getCountries(),
  ]);

  console.log("[HOME] products:", productsData.status, productsData.reason?.message ?? "");
  console.log("[HOME] categories:", categoriesData.status, categoriesData.reason?.message ?? "");
  console.log("[HOME] brands:", brandsData.status, brandsData.reason?.message ?? "");
  console.log("[HOME] countries:", countriesData.status, countriesData.reason?.message ?? "");

  const products = productsData.status === "fulfilled" ? (productsData.value?.products ?? []) : [];
  const categories = categoriesData.status === "fulfilled" ? (categoriesData.value?.categories ?? []) : [];
  const brands = brandsData.status === "fulfilled" ? (brandsData.value?.brands ?? []) : [];
  const countries = countriesData.status === "fulfilled" ? (countriesData.value?.countries ?? []) : [];

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
