
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Navigation() {
  return (
    <header className="w-full bg-transparent backdrop-blur-sm sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
              LightRAG Query Assistant
            </h1>
            <nav className="hidden md:flex space-x-4">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#docs" className="text-gray-300 hover:text-white transition-colors">
                Documentation
              </a>
            </nav>
          </div>
          
          <Button variant="ghost" className="sm:hidden text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
