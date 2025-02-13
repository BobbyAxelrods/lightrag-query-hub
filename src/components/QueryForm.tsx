
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

  // Test function to demonstrate proper formatting
  const testFormatting = () => {
    const sampleText = `# Overview of the Prime Cash Campaign

**Prime Cash Campaign** is a marketing initiative launched by **Prudential Assurance Malaysia Berhad (PAMB)** aimed at incentivizing customers to purchase specific medical insurance plans during a designated campaign period. This promotional campaign is particularly notable for its structured reward system, which provides financial incentives to eligible customers based on their policy selections and compliance with stipulated criteria.

## Campaign Duration and Incentives

The campaign is set to take place from **May 1, 2024, to May 31, 2024**. During this time, customers have the opportunity to earn cash rewards for purchasing eligible medical plans. The rewards vary based on specific criteria:

- **PRUMan and PRULady Policies:** Customers can receive a cash reward of **RM125** when they purchase these policies, provided they meet certain preconditions.
- **PRUWith You Policies:** The cash rewards are tiered based on the annual premium and additional riders attached to the policies:
  - **Tier 1:** A cash reward of **RM250** is available for policies that meet a minimum annual premium of RM2,400 and include a Mom and Baby Care rider or Medical rider.
  - **Tier 2:** Customers who opt for sustainability features and meet the Tier 1 criteria can receive a double cash reward of **RM500**.

## Eligibility Requirements

To qualify for these rewards, customers must ensure the following conditions are met:

1. The policy must be in effect with no partial withdrawals until the end of the campaign.
2. Customers must opt for an automatic recurring payment method by **June 15, 2024**.
3. Premium payments must be current as of the crediting date of the rewards, expected by **February 28, 2025**.
4. Customers must provide their correct bank account details to facilitate the crediting of the rewards.

## Credit and Administration

PAMB is responsible for administering and tracking the campaign, including managing eligibility and distributing cash rewards. Each reward is credited directly to the customer's designated bank account, emphasizing the need for accurate and up-to-date account information.

## Conclusion

The Prime Cash Campaign represents an essential strategy for Prudential to enhance customer engagement while promoting its insurance offerings. By providing a structured rewards system and clearly defined eligibility requirements, PAMB seeks to incentivize purchases and foster customer loyalty throughout the campaign period.`;

    setStreamingResponse(sampleText);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      testFormatting(); // For testing the formatting
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
            let separator = '';
            if (prev.endsWith('\n')) {
              separator = '';
            } else if (chunk.startsWith('#')) {
              separator = '\n\n';
            } else if (chunk.startsWith('-')) {
              separator = '\n';
            } else if (!prev.endsWith(' ')) {
              separator = ' ';
            }
            return prev + separator + chunk;
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
            placeholder="Enter your question... (or leave empty to see formatting example)"
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
            query.trim() ? "Submit Query" : "Show Formatting Example"
          )}
        </Button>
      </form>

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
