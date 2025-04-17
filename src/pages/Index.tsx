
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { QueryForm } from "@/components/QueryForm";
import { Indexer } from "@/components/Indexer";
import { HealthCheck } from "@/components/HealthCheck";
import { Background3D } from "@/components/Background3D";
import { GraphVisualization } from "@/components/GraphVisualization";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"query" | "indexer" | "graph">("query");

  return (
    <div className="relative min-h-screen text-[#4A4036]">
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
                    ? "bg-[#E38C40] text-white shadow-lg shadow-[#E38C40]/20"
                    : "bg-[#F9B054]/10 text-[#4A4036] hover:bg-[#F9B054]/20"
                }`}
              >
                Query
              </button>
              <button
                onClick={() => setActiveTab("indexer")}
                className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === "indexer"
                    ? "bg-[#F9B054] text-white shadow-lg shadow-[#F9B054]/20"
                    : "bg-[#F9B054]/10 text-[#4A4036] hover:bg-[#F9B054]/20"
                }`}
              >
                Indexer
              </button>
              <button
                onClick={() => setActiveTab("graph")}
                className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === "graph"
                    ? "bg-[#F9B054] text-white shadow-lg shadow-[#F9B054]/20"
                    : "bg-[#F9B054]/10 text-[#4A4036] hover:bg-[#F9B054]/20"
                }`}
              >
                Graph
              </button>
            </div>

            <div className="transform transition-all duration-200">
              {activeTab === "query" && <QueryForm />}
              {activeTab === "indexer" && <Indexer />}
              {activeTab === "graph" && <GraphVisualization />}
            </div>
          </div>
        </main>

        <HealthCheck />
      </div>
    </div>
  );
};

export default Index;
