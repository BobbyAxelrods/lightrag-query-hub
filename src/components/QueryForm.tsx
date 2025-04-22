
import { useState, useEffect, useRef } from "react";
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
import { Loader2, Clock, AlertCircle, ServerOff } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export function QueryForm() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"local" | "global" | "hybrid">("hybrid");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [contextBuildTime, setContextBuildTime] = useState<number | null>(null);
  const [totalTime, setTotalTime] = useState<number | null>(null);
  const [apiConnectionStatus, setApiConnectionStatus] = useState<"unknown" | "connected" | "disconnected">("unknown");
  const [debugResponse, setDebugResponse] = useState<any>(null);
  const responseRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response]);

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
    setResponse("");
    setError(null);
    setContextBuildTime(null);
    setTotalTime(null);
    setDebugResponse(null);

    const startTime = performance.now();

    try {
      const result = await queryAPI({
        query,
        mode,
        only_need_context: false,
      });

      const endTime = performance.now();
      setTotalTime((endTime - startTime) / 1000);
      setContextBuildTime((endTime - startTime) / 1000);
      setApiConnectionStatus("connected");
      
      // Store the full result for debugging
      setDebugResponse(result);

      if (result.status === "error") {
        setError(result.message || "An error occurred processing your query");
        toast({
          title: "Error",
          description: result.message || "Failed to process query",
          variant: "destructive",
        });
      } else {
        // Extract response from the result using multiple potential paths
        let responseText = "";
        
        if (result.data?.choices?.[0]?.message?.content) {
          // Standard OpenAI-like response format
          responseText = result.data.choices[0].message.content;
        } else if (typeof result.data === "string") {
          // Plain string response
          responseText = result.data;
        } else if (result.message && typeof result.message === "string") {
          // Message field as string
          responseText = result.message;
        } else if (result.data?.answer) {
          // Some APIs return {data: {answer: "..."}}
          responseText = result.data.answer;
        } else if (result.data?.response) {
          // Some APIs return {data: {response: "..."}}
          responseText = result.data.response;
        } else if (result.data?.text) {
          // Some APIs return {data: {text: "..."}}
          responseText = result.data.text;
        } else if (result.data?.result) {
          // Some APIs return {data: {result: "..."}}
          responseText = result.data.result;
        } else if (result.data && typeof result.data === "object") {
          // If it's an object but none of the above, stringify it
          responseText = JSON.stringify(result.data, null, 2);
        } else {
          responseText = "Response received but format is unknown. Check console for details.";
          console.log("Unknown response format:", result);
        }

        setResponse(responseText);
        toast({
          title: "Success",
          description: "Query processed successfully",
        });
      }
    } catch (error: any) {
      console.error("Query Form Error:", error);
      
      // Check if it's a network error
      if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
        setApiConnectionStatus("disconnected");
        setError(`Cannot connect to API server at ${API_URL}. Please ensure the backend server is running.`);
      } else {
        setError(error.message || "Failed to process query");
      }
      
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
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 bg-[#F5F5F3]/80 backdrop-blur-sm rounded-lg shadow-xl animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="query" className="block text-sm font-medium text-[#4A4036]">
            Your Query
          </label>
          <Input
            id="query"
            placeholder="Enter your question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/50 border-[#E38C40]/20 text-[#4A4036] placeholder-[#4A4036]/50"
          />
        </div>

        <div className="space-y-2 flex-1">
          <label className="block text-sm font-medium text-[#4A4036]">Query Mode</label>
          <Select value={mode} onValueChange={(value: "local" | "global" | "hybrid") => setMode(value)}>
            <SelectTrigger className="bg-white/50 border-[#E38C40]/20 text-[#4A4036]">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent className="bg-white border-[#E38C40]/20">
              <SelectItem value="local" className="text-[#4A4036] hover:bg-[#F9B054]/10">Local</SelectItem>
              <SelectItem value="global" className="text-[#4A4036] hover:bg-[#F9B054]/10">Global</SelectItem>
              <SelectItem value="hybrid" className="text-[#4A4036] hover:bg-[#F9B054]/10">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-[#E38C40] hover:bg-[#F9B054] text-white shadow-lg hover:shadow-xl transition-all duration-200" 
          disabled={isLoading}
        >
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

      {apiConnectionStatus === "disconnected" && !isLoading && (
        <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md text-orange-700">
          <ServerOff className="h-5 w-5" />
          <span>API Server appears to be offline. Check your backend connection.</span>
        </div>
      )}

      {(contextBuildTime !== null || totalTime !== null) && (
        <div className="mt-4 space-y-2 text-sm text-[#4A4036]/70">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Response Time: {totalTime?.toFixed(2)}s</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-8 p-6 bg-red-50/90 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg mb-2 text-red-700">Error Processing Query</h3>
              <p className="text-red-600">{error}</p>
              <p className="mt-4 text-sm text-red-600/80">
                Please check that your backend server is running correctly at {API_URL}.
              </p>
            </div>
          </div>
        </div>
      )}

      {response && (
        <div 
          ref={responseRef}
          className="mt-8 p-8 bg-[#F5F5F3]/90 rounded-lg max-h-[800px] overflow-y-auto scroll-smooth border border-[#E38C40]/20"
        >
          <h3 className="font-semibold text-xl mb-6 text-[#4A4036]">Response:</h3>
          <div className="prose prose-lg max-w-none 
            prose-headings:text-[#4A4036] prose-headings:font-semibold prose-headings:mt-8 prose-headings:mb-4 
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-[#4A4036] prose-p:leading-relaxed prose-p:mb-4 
            prose-li:text-[#4A4036] prose-li:my-1
            prose-strong:text-[#4A4036] prose-strong:font-semibold 
            prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
            [&>ul]:list-disc [&>ul]:pl-6 
            [&_ul]:list-disc [&_ul]:pl-6 
            [&>ol]:list-decimal [&>ol]:pl-6
            [&_li]:my-1 [&_li]:pl-2
            prose-pre:bg-white/50 prose-pre:p-4 prose-pre:rounded-lg
            prose-code:text-[#4A4036] prose-code:bg-white/50 prose-code:px-1 prose-code:rounded
            prose-table:border-collapse prose-table:my-4 prose-table:w-full
            prose-th:border prose-th:border-[#E38C40]/20 prose-th:p-2 prose-th:bg-[#F9B054]/10
            prose-td:border prose-td:border-[#E38C40]/20 prose-td:p-2
            whitespace-pre-wrap break-words"
          >
            <ReactMarkdown components={{
              table: ({node, ...props}) => (
                <div className="overflow-x-auto my-4">
                  <table className="border-collapse w-full" {...props} />
                </div>
              ),
              th: ({node, ...props}) => (
                <th className="border border-[#E38C40]/20 p-2 bg-[#F9B054]/10 text-left" {...props} />
              ),
              td: ({node, ...props}) => (
                <td className="border border-[#E38C40]/20 p-2" {...props} />
              )
            }}>
              {response}
            </ReactMarkdown>
          </div>
        </div>
      )}
      
      {debugResponse && !response && !error && (
        <div className="mt-8 p-6 bg-yellow-50/90 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-lg mb-3 text-yellow-700">Debug Response Information</h3>
          <p className="text-yellow-800 mb-2">The response was received but couldn't be properly displayed.</p>
          <div className="bg-white/80 p-4 rounded-md overflow-x-auto">
            <pre className="text-xs text-gray-800">
              {JSON.stringify(debugResponse, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
