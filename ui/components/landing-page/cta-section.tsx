import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ConnectModal } from "@mysten/dapp-kit";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="container mx-auto px-4 py-20">
      <Card className="p-12 text-center bg-background">
        <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
          Join the future of collaborative AI. Start building privacy-preserving
          machine learning applications today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ConnectModal trigger={<Button size="lg">Launch Platform</Button>} />
          <Link
            href={"https://github.com/vrag99/Sui-FL/tree/main"}
            target="_blank"
          >
            <Button size="lg" variant="outline">
              Read Documentation
            </Button>
          </Link>
        </div>
      </Card>
    </section>
  );
};

export default CTASection;
