import { ArrowDown, Database, Download, GitBranch, Network, Users, Upload } from "lucide-react";
import { Badge } from "../ui/badge";
import React from "react";

const steps = [
  {
    title: "Local Training & Data Privacy",
    content: (
      <>
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {["A", "B", "C"].map((user) => (
            <div key={user} className="text-center">
              <div className="bg-card border-b border-b-primary/50 rounded-t-lg p-6 mb-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <h4 className="font-semibold mb-2">User {user}</h4>
                <div className="text-sm space-y-2">
                  <div className="bg-background  text-secondary-foreground rounded p-2">Local Dataset</div>
                  <div className="bg-background text-secondary-foreground rounded p-2">
                    Model Training
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-muted-foreground mt-6">
          Each participant trains models locally on their private data,
          ensuring data never leaves their environment.
        </p>
      </>
    ),
  },
  {
    title: "Federated Aggregation",
    content: (
      <>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="bg-card rounded-lg p-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <GitBranch className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold text-center mb-4">
                Backend Coordinator
              </h4>
              <div className="space-y-2">
                {[
                  {
                    title: "Model Weights Collection",
                    description: "Aggregates updates from all participants"
                  },
                  {
                    title: "Federated Averaging",
                    description: "Combines models using advanced algorithms"
                  },
                  {
                    title: "Global Model Update",
                    description: "Creates improved global model"
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-background rounded p-3 text-sm">
                    <div className="font-medium mb-1">{item.title}</div>
                    <div className="text-muted-foreground">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-card rounded-lg p-6">
              <h4 className="font-semibold text-center mb-4">
                Aggregation Process
              </h4>
              <div className="space-y-3">
                {[
                  "Model Weights",
                  "Gradient Updates", 
                  "Performance Metrics"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-highlight rounded-full animate-pulse"></div>
                    <div className="bg-background rounded p-2 flex-1 text-sm">
                      {item}
                    </div>
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-muted-foreground mt-6">
          The backend securely aggregates model updates without accessing raw
          data, creating a globally improved model.
        </p>
      </>
    ),
  },
  {
    title: "Decentralized Storage & Publishing",
    content: (
      <>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Database className="h-5 w-5 text-highlight" />
              Walrus Storage
            </h4>
            <div className="bg-card rounded-lg p-6">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-background border-b rounded p-3 text-center text-xs"
                  >
                    Shard {i + 1}
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <div>• Model weights distributed across network</div>
                <div>• Redundant storage for high availability</div>
                <div>• Cryptographic verification</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Network className="h-5 w-5 text-highlight" />
              SUI Blockchain
            </h4>
            <div className="bg-card rounded-lg p-6">
              <div className="space-y-3">
                {[
                  {
                    title: "Smart Contracts",
                    description: "Governance and incentives"
                  },
                  {
                    title: "Model Registry",
                    description: "Version control and metadata"
                  },
                  {
                    title: "Access Control",
                    description: "Permissions and authentication"
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-background rounded p-3">
                    <div className="font-medium text-sm mb-1">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-muted rounded-lg px-4 py-2">
            <Download className="h-4 w-4 text-primary" />
            <span className="text-sm">
              Global model distributed back to participants
            </span>
          </div>
        </div>

        <p className="text-center text-muted-foreground mt-6">
          The improved global model is stored on Walrus and registered on Sui,
          then distributed back to all participants for the next training
          round.
        </p>
      </>
    ),
  }
];

const ArchitectureSection = () => {
  return (
    <section id="architecture" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 tracking-tighter">System Architecture</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          How Sui FL orchestrates federated learning across the decentralized
          network
        </p>
      </div>

      <div className="space-y-12">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div className="flex justify-center">
                <ArrowDown className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div className="rounded-lg p-8">
              <div className="flex items-center gap-4 mb-8">
                <Badge className="tracking-tight">
                  Step {index + 1}
                </Badge>
                <h3 className="text-2xl font-semibold">{step.title}</h3>
              </div>
              {step.content}
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default ArchitectureSection;
