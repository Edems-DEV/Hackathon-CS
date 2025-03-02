import ErrorMessage from "@/components/ui/ErrorMessage";
import { IErrorMessage } from "@/lib/types/IErrorMessage";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RunnerMetricsTab from "../../components/features/runners/RunnerMetricsTab";
import { IMetrics } from "../../lib/types/IMetrics";
import { RunnerModel } from "@/lib/models/RunnerModel";
import { DetailRunnerHeader } from "@/components/DetailHeader";
import "@/components/features/runners/circle.css";
import JobsDataTable from "@/components/features/jobs/JobDataTable";
import { useUserValidate } from "@/lib/utils/validateUser";
import LoadingSkeletonMetrics from "@/components/ui/LoadingSkeletonMetrics";
import { useTranslation } from "react-i18next";

export default function RunnerDetailPage() {
  const { t } = useTranslation();

  useUserValidate();
  const params = useParams();
  const runnerId = params.id;

  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tabs");
  const defaultTab = tabParam || "jobs";

  const runnerQuery = useQuery({
    queryKey: ["runner", runnerId],
    queryFn: async () => await RunnerModel.getRunnerById(runnerId!),
  });

  const metricsQuery = useQuery({
    queryKey: ["runnerMetrics", runnerId],
    queryFn: async () => await RunnerModel.getMetricsByRunner(runnerId!),
  });

  if (runnerQuery.data && "error" in runnerQuery.data) {
    return <ErrorMessage errorMessage={runnerQuery.data as IErrorMessage} />;
  }

  if (metricsQuery.data && "error" in metricsQuery.data) {
    return <ErrorMessage errorMessage={metricsQuery.data as IErrorMessage} />;
  }

  const title =
    runnerQuery.data && !("error" in runnerQuery.data) && runnerQuery.data.id
      ? runnerQuery.data.id.slice(-5).toUpperCase()
      : "";

  return (
    <main>
      <div>
        <DetailRunnerHeader
          section={t("translation:runners:detail_title")}
          title={runnerQuery.isLoading ? "Loading..." : title}
          state={
            runnerQuery.isLoading
              ? undefined
              : "state" in runnerQuery.data
              ? runnerQuery.data.state
              : undefined
          }
        />
        <div className="w-full">
          <Tabs defaultValue={defaultTab}>
            <TabsList className="bg-[#27272A] text-gray-500 w-[200px]">
              <TabsTrigger className="w-[100px]" value="jobs">
                {t("translation:runners:tabs_jobs")}
              </TabsTrigger>
              <TabsTrigger className="w-[100px]" value="metrics">
                {t("translation:runners:tabs_metrics")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="jobs">
              <JobsDataTable limit={25} isNav={false} runnerId={runnerId} />
            </TabsContent>
            <TabsContent value="metrics" className="p-4 border rounded ">
              {metricsQuery.isLoading ? (
                <LoadingSkeletonMetrics />
              ) : (
                <RunnerMetricsTab
                  runnerMetrics={metricsQuery.data as IMetrics}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
