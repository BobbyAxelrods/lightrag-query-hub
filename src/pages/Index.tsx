
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { QueryForm } from "@/components/QueryForm";
import { GraphVisualization } from "@/components/GraphVisualization";
import { Background3D } from "@/components/Background3D";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MessageCircle, Plus, Settings } from "lucide-react";

interface Message {
  id: string;
  query: string;
  response: string;
  timestamp: Date;
}

interface Session {
  id: string;
  name: string;
  messages: Message[];
  timestamp: Date;
}

const testSessions: Session[] = [
  {
    id: "1",
    name: "Graph Analysis Session 1",
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    messages: [
      {
        id: "1-1",
        query: "What are the connections between Node A and Node B?",
        response: "Based on the graph analysis, Node A has a direct connection to Node B through a 'RELATES_TO' relationship.",
        timestamp: new Date(Date.now() - 7200000)
      },
      {
        id: "1-2",
        query: "Show more details about this connection.",
        response: "The 'RELATES_TO' relationship between Node A and Node B has a weight of 0.8 and was created 3 days ago.",
        timestamp: new Date(Date.now() - 7000000)
      }
    ]
  },
  {
    id: "2",
    name: "Dependency Analysis",
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    messages: [
      {
        id: "2-1",
        query: "Show all dependencies for Node C",
        response: "Node C depends on nodes D and E directly.",
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: "2-2",
        query: "What are the indirect dependencies?",
        response: "Through Node D, Node C indirectly depends on nodes F and G.",
        timestamp: new Date(Date.now() - 3300000)
      }
    ]
  }
];

const Index = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showGraph, setShowGraph] = useState(true);
  const [sessions, setSessions] = useState<Session[]>(testSessions);
  const [activeSessionId, setActiveSessionId] = useState<string>("1");

  const createNewSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      name: `New Session ${sessions.length + 1}`,
      messages: [],
      timestamp: new Date()
    };
    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
  };

  const handleQuerySubmit = (query: string, response: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      query,
      response,
      timestamp: new Date()
    };

    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        return {
          ...session,
          messages: [...session.messages, newMessage]
        };
      }
      return session;
    }));
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <div className="relative h-screen overflow-hidden text-[#4A4036] bg-[#F8F8F8]">
      <Background3D />
      
      <div className="relative z-10 h-screen flex flex-col">
        <Navigation />
        
        <div className="flex-1 flex min-h-0">
          {/* Session Sidebar */}
          <div 
            className={cn(
              "w-80 bg-white/80 backdrop-blur-sm border-r border-[#E38C40]/10 transition-all duration-300 flex flex-col",
              !showSidebar && "-translate-x-full"
            )}
          >
            <div className="p-4 border-b border-[#E38C40]/10 flex justify-between items-center">
              <Button 
                variant="outline" 
                className="flex-1 justify-start text-[#4A4036]"
                onClick={createNewSession}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 w-8 h-8 p-0"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "p-3 rounded-lg cursor-pointer hover:bg-[#E38C40]/5 transition-colors",
                      activeSessionId === session.id && "bg-[#E38C40]/10"
                    )}
                    onClick={() => setActiveSessionId(session.id)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{session.name}</h3>
                      <span className="text-xs text-[#4A4036]/60 ml-2 flex-shrink-0">
                        {session.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Show sidebar toggle when collapsed */}
          {!showSidebar && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-0 top-4 w-8 h-8 p-0 bg-white/80 hover:bg-white"
              onClick={() => setShowSidebar(true)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          {/* Main Content */}
          <div className="flex-1 flex min-h-0">
            <div className={cn(
              "flex-1 flex flex-col min-h-0 transition-all duration-300",
              showGraph && "mr-[500px]"
            )}>
              <div className="h-14 px-4 border-b border-[#E38C40]/10 flex items-center gap-4 flex-shrink-0 bg-white/80 backdrop-blur-sm">
                <h1 className="text-lg font-medium flex-1">
                  {activeSession?.name || "New Chat"}
                </h1>
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
                    {activeSession?.messages.map((message) => (
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
                            <p className="text-[#4A4036]">{message.response}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-[#E38C40]/10">
                  <div className="max-w-3xl mx-auto w-full">
                    <QueryForm onQueryComplete={handleQuerySubmit} />
                  </div>
                </div>
              </div>
            </div>

            {/* Graph Viewer */}
            <div className={cn(
              "fixed right-0 top-14 bottom-0 w-[500px] bg-white/80 backdrop-blur-sm border-l border-[#E38C40]/10 transition-all duration-300",
              !showGraph && "translate-x-full"
            )}>
              <div className="h-full p-4">
                <GraphVisualization />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
