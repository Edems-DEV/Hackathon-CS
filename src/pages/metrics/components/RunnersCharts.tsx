import ErrorMessage from "@/components/ui/ErrorMessage";
import { RunnerModel } from "@/lib/models/RunnerModel";
import { IErrorMessage } from "@/lib/types/IErrorMessage";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { MetricItems, PieStats } from "./MetricsShared";
import { ChartCard2 } from "@/components/features/charts/ChartCard";
import { ContainerIcon } from "lucide-react";
import CustomPieChart from "@/components/features/charts/CustomPieChart";
import { IRunner } from "@/lib/types/IRunner";
import Throbber from "@/components/ui/Throbber";
import ChartSelectInput from "@/components/ChartSelectInput";
import LoadingSkeletonMetrics from "@/components/ui/LoadingSkeletonMetrics";

const RUNNERS_CHART_CONFIG = {
  count: {
    label: "Count",
  },
  idle: {
    label: "Idle",
  },
  active: {
    label: "Active",
  },
  failed: {
    label: "Failed",
  },
  offline: {
    label: "Offline",
  },
};

export default function RunnersCharts() {
  const [searchOrg, setSearchOrg] = useState(" ");
  const [searchDate, setSearchDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const runnersQuery = useQuery({
    queryKey: ["runners", searchDate, searchOrg],
    queryFn: async () => {
      return await RunnerModel.getRunners(
        undefined,
        undefined,
        undefined,
        undefined,
        "asc",
        { ...(searchOrg !== " " && { organization_eq: searchOrg }) }
      );
    },
  });

  if (runnersQuery.data && "error" in runnersQuery.data)
    return <ErrorMessage errorMessage={runnersQuery.data as IErrorMessage} />;

  if (runnersQuery.error) {
    const error: IErrorMessage = {
      code: "500",
      error: "Internal server error",
      message: "Server responded with undefined",
    };
    return <ErrorMessage errorMessage={error}></ErrorMessage>;
  }

  if (runnersQuery.isLoading) return <LoadingSkeletonMetrics />;
  const runnersData = runnersQuery.data as IRunner[];
  const rStateData = createRunnersData(runnersData);

  return (
    <>
      {runnersQuery.isLoading && <LoadingSkeletonMetrics />}
      {!runnersQuery.isLoading && (
        <ChartCard2
          header="Runners"
          description="Current state of runners"
          icon={<ContainerIcon />}
          content={
            <div>
              <div className="flex gap-4 max-w-fit">
                <div className="w-20">
                  <ChartSelectInput
                    onValueChange={(e) => setSearchOrg(e)}
                    defaultValue={searchOrg}
                  />
                </div>
              </div>
              {runnersData.length > 0 ? (
                <CustomPieChart
                  chartConfig={RUNNERS_CHART_CONFIG}
                  chartData={rStateData}
                  innerRadius={0}
                  label={true}
                />
              ) : (
                <p>No data for selected options</p>
              )}
            </div>
          }
        />
      )}
    </>
  );
}

function createRunnersData(data: IRunner[]) {
  let newData: object[] = [];
  const idleR = new PieStats("idle", "hsl(210, 80%, 50%)");
  const activeR = new PieStats("active", "hsl(161.4 93.5% 30.4%)");
  const failedR = new PieStats("failed", "hsl(0, 91%, 49%)");
  const offlineR = new PieStats("offline", "hsl(0 0% 45.1%)");

  data.forEach((r) => {
    if (r.state.toLowerCase() === "idle") {
      idleR.count++;
    } else if (r.state.toLowerCase() === "failed") {
      failedR.count++;
    } else if (r.state.toLowerCase() === "active") {
      activeR.count++;
    } else {
      offlineR.count++;
    }
  });

  newData.push(idleR, activeR, failedR, offlineR);
  return newData;
}
