import { Shield, Network, Database, Users, Brain, Zap } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Privacy-First",
    description:
      "Train models without exposing raw data. Federated learning ensures your data stays local and secure.",
  },
  {
    icon: Network,
    title: "Decentralized Network",
    description:
      "Built on Sui blockchain for transparent, trustless collaboration between multiple parties.",
  },
  {
    icon: Database,
    title: "Walrus Storage",
    description:
      "Leverage Walrus for efficient, decentralized storage of model weights and training artifacts.",
  },
  {
    icon: Users,
    title: "Multi-User Support",
    description:
      "Enable multiple users to collaborate on model training while maintaining data sovereignty.",
  },
  {
    icon: Brain,
    title: "Model Publishing",
    description:
      "Publish and share trained models securely with built-in versioning and access controls.",
  },
  {
    icon: Zap,
    title: "High Performance",
    description:
      "Optimized for speed and efficiency with advanced aggregation algorithms and parallel processing.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 tracking-tighter">
          Why Choose Sui FL?
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Experience the next generation of collaborative machine learning with
          our cutting-edge platform
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="bg-card border-l-2 border-l-highlight/80 rounded-l-none rounded-r-md">
              <CardHeader className=" flex flex-row items-center gap-4">
                <Icon className="size-10 text-primary" />
                <CardTitle className="tracking-tight">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesSection;
