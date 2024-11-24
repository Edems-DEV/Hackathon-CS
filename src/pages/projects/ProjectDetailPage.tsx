import { useParams } from "react-router-dom";
import { CircleIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DetailHeader from "@/components/DetailHeader";
import JobsDataTable from "@/components/features/jobs/JobDataTable";
import AutomationsDataTable from "../automations/automations/AutomationsDataTable";
import { userValidate } from "@/lib/utils/validateUser";
import { useTranslation } from "react-i18next";

export default function ProjectDetailPage() {
  const { t } = useTranslation();
  userValidate();
  const params = useParams();
  const id = params.id;

  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tabs");
  const defaultTab = tabParam || "jobs";

  const title = id?.split("_")[1] ?? "";
  return (
    <main>
      <div>
        <DetailHeader
          section={t("translation:projects:detail_title")}
          title={title}
        />
        <div>
          <Tabs defaultValue={defaultTab}>
            <TabsList className="bg-[#27272A] text-gray-500 w-[200px]">
              <TabsTrigger className="w-[100px]" value="jobs">
                {t("translation:projects:tabs_jobs")}
              </TabsTrigger>
              <TabsTrigger className="w-[100px]" value="automations">
                {t("translation:projects:tabs_automations")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="jobs">
              <JobsDataTable limit={25} isNav={true} id={id} />
            </TabsContent>
            <TabsContent value="automations">
              <AutomationsDataTable limit={25} isNav={true} id={id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}

// function StateItem({ title, color }: { title: string; color: string }) {
//   return (
//     <div className="flex flex-row items-center">
//       <CircleIcon size={8} className={`mr-2 fill-state_${color} stroke-none`} />
//       <span>{title}</span>
//     </div>
//   );
// }
