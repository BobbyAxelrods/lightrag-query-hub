
import { Button } from "@/components/ui/button";
import { Network, Eye, EyeOff, Minimize2 } from "lucide-react";

interface GraphControlsProps {
  showGraph: boolean;
  showLabels: boolean;
  hideIsolatedNodes: boolean;
  onToggleGraph: () => void;
  onToggleLabels: () => void;
  onToggleIsolatedNodes: () => void;
}

export function GraphControls({
  showGraph,
  showLabels,
  hideIsolatedNodes,
  onToggleGraph,
  onToggleLabels,
  onToggleIsolatedNodes,
}: GraphControlsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        onClick={onToggleGraph}
        className="bg-[#E38C40] hover:bg-[#F9B054] text-white shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Network className="mr-2 h-4 w-4" />
        {showGraph ? "Hide Network Graph" : "Show Network Graph"}
      </Button>

      {showGraph && (
        <>
          <Button
            onClick={onToggleLabels}
            variant="outline"
            className="border-[#E38C40]/20 text-[#4A4036] hover:bg-[#F9B054]/10 shadow-sm"
          >
            {showLabels ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" />
                Hide Labels
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Show Labels
              </>
            )}
          </Button>

          <Button
            onClick={onToggleIsolatedNodes}
            variant="outline"
            className="border-[#E38C40]/20 text-[#4A4036] hover:bg-[#F9B054]/10 shadow-sm"
          >
            <Minimize2 className="mr-2 h-4 w-4" />
            {hideIsolatedNodes ? "Show All Nodes" : "Hide Isolated Nodes"}
          </Button>
        </>
      )}
    </div>
  );
}
