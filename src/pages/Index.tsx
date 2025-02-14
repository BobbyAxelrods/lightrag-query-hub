
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { QueryForm } from "@/components/QueryForm";
import { Indexer } from "@/components/Indexer";
import { HealthCheck } from "@/components/HealthCheck";
import { GraphVisualization } from "@/components/GraphVisualization";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"query" | "indexer">("query");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab("query")}
              className={`px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                activeTab === "query"
                  ? "bg-primary text-white transform hover:-translate-y-0.5"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Query
            </button>
            <button
              onClick={() => setActiveTab("indexer")}
              className={`px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                activeTab === "indexer"
                  ? "bg-primary text-white transform hover:-translate-y-0.5"
                  : "bg-white text-gray-600 hover:bg-gray-50"
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
  );
};

export default Index;
