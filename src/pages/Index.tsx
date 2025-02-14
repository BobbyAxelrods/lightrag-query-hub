
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { QueryForm } from "@/components/QueryForm";
import { Indexer } from "@/components/Indexer";
import { HealthCheck } from "@/components/HealthCheck";
import { GraphVisualization } from "@/components/GraphVisualization";
import { Background3D } from "@/components/Background3D";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"query" | "indexer">("query");

  return (
    <div className="relative min-h-screen">
      <Background3D />
      
      <div className="relative z-10">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex justify-center space-x-4">
              <button
                onClick={() => setActiveTab("query")}
                className={`px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                  activeTab === "query"
                    ? "bg-primary text-white transform hover:-translate-y-0.5"
                    : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white"
                }`}
              >
                Query
              </button>
              <button
                onClick={() => setActiveTab("indexer")}
                className={`px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                  activeTab === "indexer"
                    ? "bg-primary text-white transform hover:-translate-y-0.5"
                    : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white"
                }`}
              >
                Indexer
              </button>
            </div>

            <div className="transform transition-all duration-200">
              {activeTab === "query" && <QueryForm />}
              {activeTab === "indexer" && <Indexer />}
            </div>

            <GraphVisualization />
          </div>
        </main>

        <HealthCheck />
      </div>
    </div>
  );
};

export default Index;
