import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { healthCheckAPI } from "@/lib/api";
import { Activity } from "lucide-react";

export function HealthCheck() {
  const [status, setStatus] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const response = await healthCheckAPI();
      setStatus(response.status);
    } catch (error) {
      setStatus("unhealthy");
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="fixed bottom-4 right-4">
      <Button
        variant="outline"
        size="sm"
        onClick={checkHealth}
        disabled={isChecking}
        className={`flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm ${
          status === "healthy"
            ? "text-green-600 border-green-600 bg-green-50/50"
            : status === "unhealthy"
            ? "text-red-600 border-red-600 bg-red-50/50"
            : "bg-white/50"
        }`}
      >
        <Activity className="h-4 w-4" />
        <span>
          {isChecking
            ? "Checking..."
            : status
            ? `Status: ${status}`
            : "Check Health"}
        </span>
      </Button>
    </div>
  );
}