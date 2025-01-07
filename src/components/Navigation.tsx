import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Navigation() {
  const [activeTab, setActiveTab] = useState<"query" | "upload">("query");

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-xl font-bold text-gray-900">
            LightRAG Query Assistant
          </h1>
          
          <nav className="hidden sm:flex space-x-4">
            <Button
              variant={activeTab === "query" ? "default" : "ghost"}
              onClick={() => setActiveTab("query")}
            >
              Query
            </Button>
            <Button
              variant={activeTab === "upload" ? "default" : "ghost"}
              onClick={() => setActiveTab("upload")}
            >
              Upload File
            </Button>
          </nav>

          <Button variant="ghost" className="sm:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}