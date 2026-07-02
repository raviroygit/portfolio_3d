import { Hero } from "@/components/sections/Hero";
import { WhatIBuild } from "@/components/sections/WhatIBuild";
import { AiInfrastructure } from "@/components/sections/AiInfrastructure";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { InfrastructureShowcase } from "@/components/sections/InfrastructureShowcase";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { TechnicalExpertise } from "@/components/sections/TechnicalExpertise";
import { LatestWriting } from "@/components/sections/LatestWriting";
import { ContactCta } from "@/components/sections/ContactCta";
import { profilePageSchema, jsonLdScript } from "@/lib/jsonld";

export default function Home() {
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(profilePageSchema())}
      />
      <Hero />
      <WhatIBuild />
      <FeaturedProducts />
      <AiInfrastructure />
      <InfrastructureShowcase />
      <SelectedWork />
      <TechnicalExpertise />
      <LatestWriting />
      <ContactCta />
    </main>
  );
}
