
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Navigation() {
  return (
    <header className="w-full bg-[#F5F5F3]/80 backdrop-blur-sm sticky top-0 z-50 border-b border-[#E38C40]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-[#4A4036]">
              KnowledgeGraph Explorer
            </h1>
            <nav className="hidden md:flex space-x-4">
              <a href="#features" className="text-[#4A4036]/80 hover:text-[#E38C40] transition-colors">
                Features
              </a>
              <a href="#docs" className="text-[#4A4036]/80 hover:text-[#E38C40] transition-colors">
                Documentation
              </a>
            </nav>
          </div>
          
          <Button variant="ghost" className="sm:hidden text-[#4A4036]">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
