
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { QueryForm } from "@/components/QueryForm";
import { GraphVisualization } from "@/components/GraphVisualization";
import { Background3D } from "@/components/Background3D";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { GraphData } from "@/components/graph/types";
import { getGraphDataFromQuery } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
  streaming?: boolean;
}

const Index = () => {
  const [showGraph, setShowGraph] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentGraphData, setCurrentGraphData] = useState<GraphData | null>(null);
  const { toast } = useToast();

  const handleStreamUpdate = (partialResponse: string) => {
    setMessages(prev => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && lastMessage.streaming) {
        return [
          ...prev.slice(0, -1),
          { ...lastMessage, response: partialResponse }
        ];
      }
      return prev;
    });
  };

  const handleQuerySubmit = async (query: string, response: string) => {
    // Create new message
    const newMessage: Message = {
      id: Date.now().toString(),
      query,
      response: "",
      timestamp: new Date(),
      streaming: true
    };

    // Add the new message immediately
    setMessages(prev => [...prev, newMessage]);

    try {
      // Update message with final response and remove streaming flag
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last.id === newMessage.id) {
          return [...prev.slice(0, -1), { ...last, response, streaming: false }];
        }
        return prev;
      });

      // Fetch updated graph data
      const graphData = await getGraphDataFromQuery();
      console.log("Updated graph data:", graphData);
      setCurrentGraphData(graphData);
      
      toast({
        title: "Success",
        description: "Graph visualization updated",
      });
    } catch (error) {
      console.error("Error loading graph data:", error);
      toast({
        title: "Error",
        description: "Failed to load graph visualization",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative h-screen overflow-hidden text-[#4A4036] bg-[#F8F8F8]">
      <Background3D />
      
      <div className="relative z-10 h-screen flex flex-col">
        <Navigation />
        
        <div className="flex-1 flex min-h-0">
          <main className="flex-1 flex min-h-0">
            <div className={cn(
              "flex-1 flex flex-col min-h-0 transition-all duration-300",
              showGraph && "mr-[500px]"
            )}>
              <div className="h-14 px-4 border-b border-[#E38C40]/10 flex items-center gap-4 flex-shrink-0 bg-white/80 backdrop-blur-sm">
                <h1 className="text-lg font-medium flex-1">Chat Interface</h1>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setShowGraph(!showGraph)}
                >
                  <ChevronRight className={cn("h-4 w-4 transition-transform", showGraph && "rotate-180")} />
                </Button>
              </div>

              <div className="flex-1 flex flex-col min-h-0 relative">
                <ScrollArea className="flex-1 pb-[200px]">
                  <div className="max-w-3xl mx-auto w-full p-4 space-y-6">
                    {messages.map((message) => (
                      <div key={message.id} className="space-y-6">
                        <div className="flex flex-col max-w-3xl">
                          <div className="bg-[#F5F5F3] rounded-lg p-4 shadow-sm">
                            <p className="text-sm font-medium mb-2">Query</p>
                            <p className="text-[#4A4036]">{message.query}</p>
                            <p className="text-xs text-[#4A4036]/60 mt-2">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col max-w-3xl">
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-sm font-medium mb-2">Response</p>
                            <ReactMarkdown className="prose prose-sm max-w-none text-[#4A4036]">
                              {message.response}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-[#E38C40]/10">
                  <div className="max-w-3xl mx-auto w-full">
                    <QueryForm 
                      onQueryComplete={handleQuerySubmit}
                      onStreamUpdate={handleStreamUpdate}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={cn(
              "fixed right-0 top-14 bottom-0 w-[500px] bg-white/80 backdrop-blur-sm border-l border-[#E38C40]/10 transition-all duration-300",
              !showGraph && "translate-x-full"
            )}>
              <div className="h-full p-4">
                {currentGraphData && currentGraphData.nodes && currentGraphData.nodes.length > 0 && (
                  <GraphVisualization graphData={currentGraphData} />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
