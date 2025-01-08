import { Panel, MiniMap, Controls, Background } from '@xyflow/react';
import { NetworkIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface GraphControlsProps {
  onToggleGraph: () => void;
  showGraph: boolean;
}

export function GraphControls({ onToggleGraph, showGraph }: GraphControlsProps) {
  return (
    <>
      <Panel position="top-center" className="w-full max-w-4xl mx-auto">
        <Button
          onClick={onToggleGraph}
          className="w-full bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <NetworkIcon className="mr-2 h-4 w-4" />
          {showGraph ? "Hide Network Graph" : "Show Network Graph"}
        </Button>
      </Panel>
      <Controls />
      <MiniMap nodeColor="#6366f1" />
      <Background gap={12} size={1} />
    </>
  );
}