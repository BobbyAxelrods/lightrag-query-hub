import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { QueryForm } from "@/components/QueryForm";
import { GraphVisualization } from "@/components/GraphVisualization";
import { Background3D } from "@/components/Background3D";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus, Settings } from "lucide-react";

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
    <div className="relative h-screen overflow-hidden text-[#4A4036]">
      <Background3D />
      
      <div className="relative z-10 h-screen flex flex-col">
        <Navigation />
        
        <div className="flex-1 flex min-h-0">
          <div 
            className={cn(
              "w-80 bg-[#F5F5F3]/95 backdrop-blur-sm border-r border-[#E38C40]/20 transition-all duration-300 flex flex-col",
              !showSidebar && "-translate-x-full"
            )}
          >
            <div className="p-4 border-b border-[#E38C40]/20 flex-shrink-0">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={createNewSession}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Session
              </Button>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={cn(
                      "p-4 rounded-lg cursor-pointer hover:bg-[#E38C40]/10 transition-colors",
                      activeSessionId === session.id && "bg-[#E38C40]/20"
                    )}
                    onClick={() => setActiveSessionId(session.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{session.name}</h3>
                      <span className="text-xs text-[#4A4036]/60">
                        {session.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-[#4A4036]/80 truncate">
                      {session.messages.length} messages
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-4 border-b border-[#E38C40]/20 flex items-center gap-4 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold">
                {activeSession?.name || "Graph Query Assistant"}
              </h1>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-8">
                {activeSession?.messages.map((message) => (
                  <div key={message.id} className="space-y-4">
                    <div className="bg-[#F5F5F3]/80 backdrop-blur-sm rounded-lg p-6">
                      <p className="font-medium mb-2">Query:</p>
                      <p>{message.query}</p>
                      <p className="text-xs text-[#4A4036]/60 mt-2">
                        {message.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-[#F5F5F3]/80 backdrop-blur-sm rounded-lg p-6">
                      <p className="font-medium mb-2">Response:</p>
                      <p>{message.response}</p>
                    </div>
                  </div>
                ))}

                {activeSession?.messages.length ? (
                  <GraphVisualization />
                ) : null}

                <div className="pt-4">
                  <QueryForm onQueryComplete={handleQuerySubmit} />
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
