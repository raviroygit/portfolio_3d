import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MonoLabel } from "@/components/ui/MonoLabel";

export const metadata: Metadata = {
  title: "404 — Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center py-32">
      <Container className="text-center">
        <MonoLabel className="justify-center">error / 404</MonoLabel>
        <h1 className="mt-6 font-display text-display-lg font-bold text-fg">
          404
        </h1>
        <p className="mx-auto mt-4 max-w-md text-fg-muted">
          This route doesn&apos;t exist — like a model with no provider behind it.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/">Back home</Button>
          <Button href="/work" variant="outline">
            View work
          </Button>
        </div>
      </Container>
    </main>
  );
}
