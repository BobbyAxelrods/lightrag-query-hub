
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryAPI } from "@/lib/api";
import { Loader2, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface QueryFormProps {
  onQueryComplete?: (query: string, response: string) => void;
  onStreamUpdate?: (partialResponse: string) => void;
}

export function QueryForm({ onQueryComplete, onStreamUpdate }: QueryFormProps) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"local" | "global" | "hybrid">("hybrid");
  const [isLoading, setIsLoading] = useState(false);
  const [contextBuildTime, setContextBuildTime] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState<number | null>(null);
  const [isStreamEnabled, setIsStreamEnabled] = useState(true);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a query",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setContextBuildTime(null);
    setTotalTime(null);

    const startTime = performance.now();
    let contextBuildEndTime: number | null = null;
    let fullResponse = "";

    try {
      await queryAPI({
        query,
        mode,
        stream: isStreamEnabled
      }, (chunk: string) => {
        if (isStreamEnabled) {
          if (fullResponse === "") {
            contextBuildEndTime = performance.now();
            setContextBuildTime((contextBuildEndTime - startTime) / 1000);
          }
          fullResponse += chunk;
          if (onStreamUpdate) {
            onStreamUpdate(fullResponse);
          }
        } else {
          fullResponse = chunk;
          contextBuildEndTime = performance.now();
          setContextBuildTime((contextBuildEndTime - startTime) / 1000);
          if (onStreamUpdate) {
            onStreamUpdate(fullResponse);
          }
        }
      });

      const endTime = performance.now();
      setTotalTime((endTime - startTime) / 1000);

      if (onQueryComplete) {
        onQueryComplete(query, fullResponse);
      }

      setQuery("");
      toast({
        title: "Success",
        description: "Query processed successfully",
      });
    } catch (error: any) {
      console.error("Query Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process query",
        variant: "destructive",
      });
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
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Send"
            )}
          </Button>
        </div>
      </div>

      {(contextBuildTime !== null || totalTime !== null) && (
        <div className="flex items-center justify-end gap-4 text-xs text-[#4A4036]/60">
          {contextBuildTime !== null && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Context: {contextBuildTime.toFixed(2)}s</span>
            </div>
          )}
          {totalTime !== null && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Total: {totalTime.toFixed(2)}s</span>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
