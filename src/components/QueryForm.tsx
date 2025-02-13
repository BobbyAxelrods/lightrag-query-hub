
import { useState } from "react";
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
import { Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export function QueryForm() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"local" | "global" | "hybrid">("hybrid");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState<string>("");
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
    setStreamingResponse("");

    try {
      await queryAPI({
        query,
        mode,
      }, (chunk: string) => {
        setStreamingResponse(prev => prev + chunk);
      });

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
    <div className="w-full max-w-2xl mx-auto p-6 space-y-8 bg-white rounded-lg shadow-lg animate-fade-in">
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

        <div className="space-y-2">
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

      {streamingResponse && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Response:</h3>
          <div className="prose max-w-none">
            <ReactMarkdown>
              {streamingResponse}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
