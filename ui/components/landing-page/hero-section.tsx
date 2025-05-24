"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { FlickeringGrid } from "../magicui/flickering-grid";
import { useWallet, ConnectModal } from "@suiet/wallet-kit";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const { connected } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (connected) {
      router.push("/dashboard");
    }
  }, [connected]);

  const handleConnect = () => {
    if (!connected) {   
      setIsOpen(true);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <section className="relative px-4 py-40 flex items-center justify-center">
      <FlickeringGrid
        color="#60A5FA"
        className="absolute inset-0 size-[1000px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
        maxOpacity={0.3}
      />
      <div className="text-center space-y-8">
        <div className="p-[1px] w-fit mx-auto bg-gradient-to-r from-primary/50 to-highlight/50 rounded-full">
          <Badge className="bg-background text-foreground px-4 py-2 tracking-tight">
            Powered by &nbsp;
            <span className="text-primary">Sui Blockchain</span> &nbsp; & &nbsp;{" "}
            <span className="text-highlight">Walrus Storage</span>
          </Badge>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight text-highlight tracking-tighter">
          <span className="text-primary"> Federated Learning</span> <br />
          <span className="text-highlight underline underline-offset-8 decoration-highlight/80 decoration-wavy decoration-4">
            Decentralized
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Build, train, and deploy machine learning models collaboratively
          without compromising data privacy.{" "}
          <span className="text-highlight font-bold">Sui-FL</span> combines the
          power of federated learning with blockchain technology for secure,
          decentralized AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ConnectModal open={isOpen} onOpenChange={setIsOpen}>
            <Button size="lg" onClick={handleConnect}>
              Start Building
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </ConnectModal>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
