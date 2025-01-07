import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { QueryForm } from "@/components/QueryForm";
import { FileUpload } from "@/components/FileUpload";
import { HealthCheck } from "@/components/HealthCheck";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"query" | "upload">("query");

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
              onClick={() => setActiveTab("upload")}
              className={`px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg ${
                activeTab === "upload"
                  ? "bg-primary text-white transform hover:-translate-y-0.5"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Upload File
            </button>
          </div>

          <div className="transform transition-all duration-200">
            {activeTab === "query" ? <QueryForm /> : <FileUpload />}
          </div>
        </div>
      </main>

      <HealthCheck />
    </div>
  );
};

export default Index;