
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { queryAPI } from "@/lib/api";

interface QueryFormProps {
  onQueryComplete?: (query: string, response: string) => void;
  onStreamUpdate?: (partialResponse: string) => void;
}

export function QueryForm({ onQueryComplete, onStreamUpdate }: QueryFormProps) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"local" | "global" | "hybrid">("hybrid");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreamEnabled, setIsStreamEnabled] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    let fullResponse = "";

    try {
      await queryAPI({
        query,
        mode,
        stream: isStreamEnabled
      }, (chunk: string) => {
        fullResponse += chunk;
        if (onStreamUpdate) {
          onStreamUpdate(fullResponse);
        }
      });

      if (onQueryComplete) {
        onQueryComplete(query, fullResponse);
      }
      
      setQuery("");
    } catch (error) {
      console.error("Query Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Ask anything about the graph..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/50 border-[#E38C40]/20 text-[#4A4036] placeholder-[#4A4036]/50 focus:ring-2 focus:ring-[#E38C40]/30 h-12"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={mode} onValueChange={(value: "local" | "global" | "hybrid") => setMode(value)}>
            <SelectTrigger className="w-[100px] bg-white/50 border-[#E38C40]/20 text-[#4A4036] h-12">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="local">Local</SelectItem>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              "h-12 w-12 border-[#E38C40]/20",
              isStreamEnabled && "bg-[#E38C40]/10 text-[#E38C40] border-[#E38C40]"
            )}
            onClick={() => setIsStreamEnabled(!isStreamEnabled)}
          >
            <Zap className="h-4 w-4" />
          </Button>

          <Button 
            type="submit" 
            className="bg-[#E38C40] hover:bg-[#F9B054] text-white h-12 px-6"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </form>
  );
}
