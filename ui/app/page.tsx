"use client";

import { Button } from "@/components/ui/button";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex h-screen w-full items-center justify-center flex-col gap-8">
      <div className="relative z-10 flex flex-col items-center justify-center gap-8">
        <FlickeringGrid
          color="#60A5FA"
          className="absolute inset-0 size-[1000px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
          maxOpacity={0.3}
        />
        <h1 className="text-8xl font-thin font-display text-transparent bg-clip-text bg-gradient-to-r from-primary to-highlight">
          SuiFL
        </h1>
        <p className="text-2xl text-muted-foreground">
          Privacy preserving federated learning, now on Sui
        </p>
        <Button
          variant={"shine"}
          size={"lg"}
          className="font-semibold"
          onClick={() => router.push("/dashboard")}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
