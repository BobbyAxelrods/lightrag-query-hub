
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { healthCheckAPI } from "@/lib/api";
import { Activity, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function HealthCheck() {
  const [status, setStatus] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setIsChecking(true);
    setError(null);
    try {
      const response = await healthCheckAPI();
      setStatus(response.status);
    } catch (err: any) {
      setStatus("unhealthy");
      setError(err.message || "Connection failed");
      console.error("Health check failed:", err);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TooltipProvider>
      <div className="fixed bottom-4 right-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={checkHealth}
              disabled={isChecking}
              className={`flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm ${
                status === "healthy"
                  ? "text-[#4A4036] border-[#E38C40]/30 bg-[#F9B054]/10"
                  : status === "unhealthy"
                  ? "text-red-600 border-red-400/30 bg-red-400/10"
                  : "bg-white/80 text-[#4A4036] border-[#E38C40]/20"
              }`}
            >
              {status === "unhealthy" ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <Activity className="h-4 w-4" />
              )}
              <span>
                {isChecking
                  ? "Checking..."
                  : status
                  ? `Status: ${status}`
                  : "Check Health"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {error ? (
              <div>
                <p>Connection Error: {error}</p>
                <p className="text-xs mt-1">Check if backend is running at http://localhost:8000</p>
              </div>
            ) : (
              <p>Last checked: {new Date().toLocaleTimeString()}</p>
            )}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
