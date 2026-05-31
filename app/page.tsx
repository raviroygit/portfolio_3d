import { Hero } from "@/components/sections/Hero";
import { WhatIBuild } from "@/components/sections/WhatIBuild";
import { AiInfrastructure } from "@/components/sections/AiInfrastructure";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { InfrastructureShowcase } from "@/components/sections/InfrastructureShowcase";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { TechnicalExpertise } from "@/components/sections/TechnicalExpertise";
import { ContactCta } from "@/components/sections/ContactCta";

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <WhatIBuild />
      <FeaturedProducts />
      <AiInfrastructure />
      <InfrastructureShowcase />
      <SelectedWork />
      <TechnicalExpertise />
      <ContactCta />
    </main>
  );
}
