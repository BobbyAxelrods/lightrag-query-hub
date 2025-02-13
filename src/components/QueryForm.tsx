import { useState, useRef, useEffect } from "react";
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
  const responseRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [streamingResponse]);

  const formatMarkdownText = (text: string): string => {
    let formattedText = text;

    // Add spaces between words that are stuck together
    formattedText = formattedText.replace(/([a-z])([A-Z])/g, '$1 $2');
    
    // Fix spacing around bold text
    formattedText = formattedText.replace(/\*\*/g, ' **').replace(/\*\* /g, '** ');
    
    // Add proper spacing after punctuation
    formattedText = formattedText.replace(/([.!?])([A-Z])/g, '$1 $2');
    
    // Add proper spacing for lists
    formattedText = formattedText.replace(/([.!?])-/g, '$1\n-');
    
    // Add line breaks before headers
    formattedText = formattedText.replace(/([^\n])#{1,6}\s/g, '$1\n\n#');
    
    // Add line breaks after headers
    formattedText = formattedText.replace(/(#[^\n]+)/g, '$1\n');
    
    // Add proper spacing for numbered lists
    formattedText = formattedText.replace(/(\d+)\./g, '\n$1.');
    
    return formattedText;
  };

  // Test function to simulate streaming response
  const testFormatting = () => {
    const sampleText = `## Prime Cash Campaign Overview

The **Premium Package** rewards are structured as follows:

### Key Benefits
1. **Instant Rewards** up to RM500
2. **Flexible Options** for all customers
- Priority processing
- Dedicated support
- Custom benefits

### Eligibility Tiers
We offer multiple tiers to suit your needs:
- **Basic Tier**: RM125 reward
- **Advanced Tier**: RM250 reward
- **Premium Tier**: RM500 reward

### How to Apply
Follow these simple steps:
1. Submit your application
2. Choose your preferred plan
3. Complete documentation

For assistance, contact our **Customer Service** team.`;

    // Set the formatted text directly without additional processing
    setStreamingResponse(sampleText);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      // For testing purposes, trigger the test formatting
      testFormatting();
      return;
    }

    setIsLoading(true);
    setStreamingResponse("");

    try {
      await queryAPI({
        query,
        mode,
      }, (chunk: string) => {
        if (chunk.trim()) {
          setStreamingResponse(prev => {
            const formattedChunk = formatMarkdownText(chunk);
            
            // Determine if we need a space or newline between chunks
            let separator = '';
            if (prev.endsWith('\n')) {
              separator = '';
            } else if (formattedChunk.startsWith('#')) {
              separator = '\n\n';
            } else if (formattedChunk.startsWith('-')) {
              separator = '\n';
            } else if (!prev.endsWith(' ')) {
              separator = ' ';
            }

            return prev + separator + formattedChunk;
          });
        }
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
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 bg-white rounded-lg shadow-lg animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="query" className="block text-sm font-medium text-gray-700">
            Your Query
          </label>
          <Input
            id="query"
            placeholder="Enter your question... (or leave empty to see test formatting)"
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
            query.trim() ? "Submit Query" : "Show Test Formatting"
          )}
        </Button>
      </form>

      {streamingResponse && (
        <div 
          ref={responseRef}
          className="mt-8 p-8 bg-gray-50 rounded-lg max-h-[800px] overflow-y-auto scroll-smooth border border-gray-200"
        >
          <h3 className="font-semibold text-xl mb-6 text-gray-800">Response:</h3>
          <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:mt-8 prose-headings:mb-4 prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-4 prose-li:text-gray-600 prose-li:my-2 prose-strong:text-gray-800 prose-strong:font-semibold">
            <ReactMarkdown>
              {streamingResponse}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
