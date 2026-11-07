import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import Loading from "@/components/ui/Loading";
import HeroSection from "@/feature/guest/home/HeroSection";
import PropertyTypes from "@/feature/guest/home/PropertyTypes";
import SaveSearchBand from "@/feature/guest/home/SaveSearchBand";
import PopularCities from "@/feature/guest/home/PopularCities";
import HowItWorks from "@/feature/guest/home/HowItWorks";
import GetFeaturedProperties from "@/feature/guest/properties/GetFeaturedProperties";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <PropertyTypes />

      <section className="mx-auto w-full max-w-7xl px-4 py-8">
        <Suspense fallback={<Loading />}>
          <GetFeaturedProperties />
        </Suspense>
      </section>

      <SaveSearchBand />

      <Suspense fallback={null}>
        <PopularCities />
      </Suspense>

      <HowItWorks />
    </>
  );
}