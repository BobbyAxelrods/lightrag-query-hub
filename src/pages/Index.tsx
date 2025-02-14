
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
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Interactive Knowledge Graph
            </h2>
            
            <div className="mb-8 flex justify-center space-x-4">
              <button
                onClick={() => setActiveTab("query")}
                className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === "query"
                    ? "bg-blue-400/80 text-white shadow-lg shadow-blue-400/20"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                Query
              </button>
              <button
                onClick={() => setActiveTab("indexer")}
                className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === "indexer"
                    ? "bg-blue-400/80 text-white shadow-lg shadow-blue-400/20"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                Indexer
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === "documents"
                    ? "bg-blue-400/80 text-white shadow-lg shadow-blue-400/20"
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
