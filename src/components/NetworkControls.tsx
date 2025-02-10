
import { Button } from "@/components/ui/button";
import { Network, Eye, EyeOff } from "lucide-react";

interface NetworkControlsProps {
  showGraph: boolean;
  showLabels: boolean;
  onToggleGraph: () => void;
  onToggleLabels: () => void;
}

export function NetworkControls({
  showGraph,
  showLabels,
  onToggleGraph,
  onToggleLabels,
}: NetworkControlsProps) {
  return (
    <div className="flex gap-2 mb-4">
      <Button onClick={onToggleGraph}>
        <Network className="mr-2 h-4 w-4" />
        {showGraph ? "Hide Network Graph" : "Show Network Graph"}
      </Button>

      {showGraph && (
        <Button onClick={onToggleLabels} variant="outline">
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
      )}
    </div>
  );
}
