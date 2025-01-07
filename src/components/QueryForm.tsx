import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { queryAPI, QueryResponse } from "@/lib/api";
import { Loader2 } from "lucide-react";

export function QueryForm() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"hybrid" | "semantic" | "keyword">("hybrid");
  const [onlyContext, setOnlyContext] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QueryResponse | null>(null);
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
    try {
      const response = await queryAPI({
        query,
        mode,
        only_need_context: onlyContext,
      });
      setResult(response);
      toast({
        title: "Success",
        description: "Query processed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process query",
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
          <Label htmlFor="query">Your Query</Label>
          <Input
            id="query"
            placeholder="Enter your question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Query Mode</Label>
            <Select value={mode} onValueChange={(value: any) => setMode(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="semantic">Semantic</SelectItem>
                <SelectItem value="keyword">Keyword</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <Checkbox
              id="context"
              checked={onlyContext}
              onCheckedChange={(checked: boolean) => setOnlyContext(checked)}
            />
            <Label htmlFor="context">Only Need Context</Label>
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

      {result && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Response:</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{result.data}</p>
        </div>
      )}
    </div>
  );
}