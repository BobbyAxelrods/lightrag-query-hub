import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Navigation() {
  const [activeTab, setActiveTab] = useState<"query" | "upload">("query");

  return (
    <header className="w-full bg-white shadow-lg backdrop-blur-sm bg-white/90 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            LightRAG Query Assistant
          </h1>
          
          <nav className="hidden sm:flex space-x-4">
            <Button
              variant={activeTab === "query" ? "default" : "ghost"}
              onClick={() => setActiveTab("query")}
              className="shadow-sm hover:shadow-md transition-all duration-200"
            >
              Query
            </Button>
            <Button
              variant={activeTab === "upload" ? "default" : "ghost"}
              onClick={() => setActiveTab("upload")}
              className="shadow-sm hover:shadow-md transition-all duration-200"
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