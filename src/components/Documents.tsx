
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDocumentsAPI } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export function Documents() {
  const { toast } = useToast();
  
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: getDocumentsAPI,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return null;
  }

  // Transform the data from object to array format
  const documentsArray = Object.entries(documents?.data || {}).map(([id, doc]: [string, any]) => ({
    id,
    ...doc,
  }));

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900">Uploaded Documents</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Content Summary</TableHead>
              <TableHead>Chunks Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentsArray.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.id}</TableCell>
                <TableCell>
                  <Badge 
                    variant={doc.status === "processed" ? "secondary" : "destructive"}
                  >
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(doc.created_at).toLocaleString()}</TableCell>
                <TableCell>{new Date(doc.updated_at).toLocaleString()}</TableCell>
                <TableCell className="max-w-md truncate">
                  {doc.content_summary}
                </TableCell>
                <TableCell>{doc.chunks_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
