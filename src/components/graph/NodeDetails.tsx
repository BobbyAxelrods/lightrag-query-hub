
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface NodeDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNode: any | null;
}

export function NodeDetails({ isOpen, onOpenChange, selectedNode }: NodeDetailsProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Node Details</SheetTitle>
          <SheetDescription>
            {selectedNode && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Entity Type</h3>
                  <p>{selectedNode.entity_type?.replace(/"/g, '')}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-sm text-gray-600">
                    {selectedNode.description?.replace(/"/g, '').split('<SEP>').map((desc: string, index: number) => (
                      <span key={index} className="block mb-2">{desc}</span>
                    ))}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Source ID</h3>
                  <p className="text-sm text-gray-600">
                    {selectedNode.source_id?.split('<SEP>').map((source: string, index: number) => (
                      <span key={index} className="block mb-1">{source}</span>
                    ))}
                  </p>
                </div>
              </div>
            )}
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
