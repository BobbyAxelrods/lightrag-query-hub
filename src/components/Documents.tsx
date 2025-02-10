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

  // Get all column names from the first document
  const columns = documents?.data?.[0] ? Object.keys(documents.data[0]) : [];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900">Uploaded Documents</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents?.data?.map((doc: any, index: number) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={`${index}-${column}`}>
                    {typeof doc[column] === 'object' 
                      ? JSON.stringify(doc[column])
                      : doc[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}