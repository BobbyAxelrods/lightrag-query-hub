
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { QueryForm } from "@/components/QueryForm";
import { GraphVisualization } from "@/components/GraphVisualization";
import { Background3D } from "@/components/Background3D";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageCircle, Settings } from "lucide-react";

interface QueryHistory {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
}

const testQueries: QueryHistory[] = [
  {
    id: "1",
    query: "What are the connections between Node A and Node B?",
    response: "Based on the graph analysis, Node A has a direct connection to Node B through a 'RELATES_TO' relationship. Additionally, there are indirect paths through intermediate nodes.",
    timestamp: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    id: "2",
    query: "Show me all nodes connected to Node C",
    response: "Node C has direct connections to nodes D and E through 'DEPENDS_ON' relationships. There are also several second-degree connections through Node D.",
    timestamp: new Date(Date.now() - 1800000) // 30 minutes ago
  },
  {
    id: "3",
    query: "What is the shortest path between Node A and Node E?",
    response: "The shortest path from Node A to Node E is: A -> B -> D -> E, with a total of 3 hops.",
    timestamp: new Date(Date.now() - 900000) // 15 minutes ago
  }
];

const Index = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [queryHistory, setQueryHistory] = useState<QueryHistory[]>(testQueries); // Initialize with test data
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>("3"); // Show the last test query by default

  const handleQuerySubmit = (query: string, response: string) => {
    const newQuery: QueryHistory = {
      id: Date.now().toString(),
      query,
      response,
      timestamp: new Date()
    };
    setQueryHistory(prev => [...prev, newQuery]);
    setSelectedQueryId(newQuery.id);
  };

  return (
    <div className="relative h-screen overflow-hidden text-[#4A4036]">
      <Background3D />
      
      <div className="relative z-10 h-screen flex flex-col">
        <Navigation />
        
        <div className="flex-1 flex">
          {/* Sidebar */}
          <div 
            className={cn(
              "w-80 bg-[#F5F5F3]/95 backdrop-blur-sm border-r border-[#E38C40]/20 transition-all duration-300",
              !showSidebar && "-translate-x-full"
            )}
          >
            <div className="p-4 border-b border-[#E38C40]/20">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setSelectedQueryId(null)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                New Query
              </Button>
            </div>
            
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="p-4 space-y-4">
                {queryHistory.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer hover:bg-[#E38C40]/10 transition-colors",
                      selectedQueryId === item.id && "bg-[#E38C40]/20"
                    )}
                    onClick={() => setSelectedQueryId(item.id)}
                  >
                    <p className="text-sm font-medium truncate">{item.query}</p>
                    <p className="text-xs text-[#4A4036]/60">
                      {item.timestamp.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col h-full">
            <div className="p-4 border-b border-[#E38C40]/20 flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold">Graph Query Assistant</h1>
            </div>

            <ScrollArea className="flex-1">
              <div className="container max-w-4xl mx-auto p-4">
                {selectedQueryId ? (
                  <div className="space-y-8">
                    {queryHistory
                      .filter(item => item.id === selectedQueryId)
                      .map(item => (
                        <div key={item.id} className="space-y-8">
                          <div className="bg-[#F5F5F3]/80 backdrop-blur-sm rounded-lg p-6">
                            <p className="font-medium mb-4">Query:</p>
                            <p>{item.query}</p>
                          </div>
                          <div className="bg-[#F5F5F3]/80 backdrop-blur-sm rounded-lg p-6">
                            <p className="font-medium mb-4">Response:</p>
                            <p>{item.response}</p>
                          </div>
                          <GraphVisualization />
                        </div>
                      ))}
                  </div>
                ) : (
                  <QueryForm onQueryComplete={handleQuerySubmit} />
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
