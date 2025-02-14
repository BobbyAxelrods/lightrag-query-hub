
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Navigation() {
  return (
    <header className="w-full bg-[#F5F5F3]/80 backdrop-blur-sm sticky top-0 z-50 border-b border-[#E38C40]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16 relative">
          <h1 className="text-3xl font-bold text-[#E38C40] text-center tracking-tight">
            Graph RAG <span className="text-[#4A4036] text-xl font-medium">(Lite)</span>
          </h1>
          
          <Button variant="ghost" className="sm:hidden text-[#4A4036] absolute right-0">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
