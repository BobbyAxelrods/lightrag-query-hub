
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { QueryForm } from "@/components/QueryForm";
import { Indexer } from "@/components/Indexer";
import { Documents } from "@/components/Documents";
import { HealthCheck } from "@/components/HealthCheck";
import { GraphVisualization } from "@/components/GraphVisualization";
import { Background3D } from "@/components/Background3D";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"query" | "indexer" | "documents">("query");

  return (
    <div className="relative min-h-screen text-white">
      <Background3D />
      
      <div className="relative z-10">
        <Navigation />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">            
            <div className="mb-8 flex justify-center space-x-4">
              <button
                onClick={() => setActiveTab("query")}
                className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === "query"
                    ? "bg-[#9b87f5] text-white shadow-lg shadow-[#9b87f5]/20"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                Query
              </button>
              <button
                onClick={() => setActiveTab("indexer")}
                className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === "indexer"
                    ? "bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                Indexer
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === "documents"
                    ? "bg-[#D946EF] text-white shadow-lg shadow-[#D946EF]/20"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                Documents
              </button>
            </div>

            <div className="transform transition-all duration-200">
              {activeTab === "query" && <QueryForm />}
              {activeTab === "indexer" && <Indexer />}
              {activeTab === "documents" && <Documents />}
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
