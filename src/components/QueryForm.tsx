import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryAPI } from "@/lib/api";
import { Loader2, Clock } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export function QueryForm() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"local" | "global" | "hybrid">("hybrid");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState<string>("");
  const [contextBuildTime, setContextBuildTime] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState<number | null>(null);
  const [isStreamEnabled, setIsStreamEnabled] = useState(true);
  const responseRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [streamingResponse]);

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
    setStreamingResponse("");
    setContextBuildTime(null);
    setTotalTime(null);

    const startTime = performance.now();
    let contextBuildEndTime: number | null = null;

    try {
      let isFirstChunk = true;
      
      await queryAPI({
        query,
        mode,
        stream: isStreamEnabled
      }, (chunk: string) => {
        if (isFirstChunk) {
          contextBuildEndTime = performance.now();
          setContextBuildTime((contextBuildEndTime - startTime) / 1000);
          isFirstChunk = false;
        }

        if (chunk.trim()) {
          setStreamingResponse(prev => prev + chunk);
        }
      });

      const endTime = performance.now();
      setTotalTime((endTime - startTime) / 1000);

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
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="query" className="block text-sm font-medium text-gray-700">
            Your Query
          </label>
          <Input
            id="query"
            placeholder="Enter your question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <label className="block text-sm font-medium text-gray-700">Query Mode</label>
            <Select value={mode} onValueChange={(value: "local" | "global" | "hybrid") => setMode(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="stream-mode"
              checked={isStreamEnabled}
              onCheckedChange={setIsStreamEnabled}
            />
            <label
              htmlFor="stream-mode"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Stream Mode
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Submit Query"
          )}
        </Button>
      </form>

      {(contextBuildTime !== null || totalTime !== null) && (
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Context Build Time: {contextBuildTime?.toFixed(2)}s</span>
          </div>
          {totalTime !== null && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Total Time: {totalTime.toFixed(2)}s</span>
            </div>
          )}
        </div>
      )}

      {streamingResponse && (
        <div 
          ref={responseRef}
          className="mt-8 p-8 bg-gray-50 rounded-lg max-h-[800px] overflow-y-auto scroll-smooth border border-gray-200"
        >
          <h3 className="font-semibold text-xl mb-6 text-gray-800">Response:</h3>
          <div className="prose prose-lg max-w-none 
            prose-headings:font-semibold prose-headings:mt-8 prose-headings:mb-4 
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4 
            prose-li:text-gray-600 prose-li:my-1
            prose-strong:text-gray-800 prose-strong:font-semibold 
            prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
            [&>ul]:list-disc [&>ul]:pl-6 
            [&_ul]:list-disc [&_ul]:pl-6 
            [&>ol]:list-decimal [&>ol]:pl-6
            [&_li]:my-1 [&_li]:pl-2
            prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded-lg
            prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded"
          >
            <ReactMarkdown>
              {streamingResponse}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
