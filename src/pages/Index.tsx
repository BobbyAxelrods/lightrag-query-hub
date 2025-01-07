import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { QueryForm } from "@/components/QueryForm";
import { FileUpload } from "@/components/FileUpload";
import { HealthCheck } from "@/components/HealthCheck";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"query" | "upload">("query");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab("query")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "query"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Query
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "upload"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Upload File
            </button>
          </div>

          {activeTab === "query" ? <QueryForm /> : <FileUpload />}
        </div>
      </main>

      <HealthCheck />
    </div>
  );
};

export default Index;