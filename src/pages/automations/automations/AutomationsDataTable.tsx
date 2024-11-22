import { AutomationModel } from "@/lib/models/AutomationModel";
import { useQuery } from "@tanstack/react-query";
import AutomationsTable from "@/pages/automations/automations/AutomationsTable";
import { IErrorMessage } from "@/lib/types/IErrorMessage";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { IAutomationType } from "../../../lib/types/IAutomationType";
import { IAutomation } from "@/lib/types/IAutomation";
import Throbber from "@/components/ui/Throbber";
import SearchBar from "@/components/ui/table/SearchBar";
import { useState } from "react";
import SelectInput, { ISelectItem } from "@/components/SelectInput";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import DateRangePicker from "@/components/ui/table/DateRangePicker";

export default function AutomationsDataTable({
  limit = 9999,
  isNav = true,
  id,
}: {
  limit: number | undefined;
  isNav: boolean | undefined;
  id?: string;
}) {
  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const automationsQuery = useQuery({
    queryKey: [
      "automation",
      { searchText: searchText, searchDate: searchDate },
    ],
    queryFn: async () => {
      const filters = {
        ...(searchDate &&
          searchDate.from &&
          searchDate.to == undefined && {
            last_activity_start: format(
              searchDate.from,
              "yyyy-MM-dd"
            ).toString(),
          }),
        ...(searchDate &&
          searchDate.from &&
          searchDate.to && {
            last_activity_gte: format(
              searchDate.from,
              "yyyy-MM-dd'T'HH:mm:ss"
            ).toString(),
          }),
        ...(searchDate &&
          searchDate.from &&
          searchDate.to && {
            last_activity_lte: format(
              searchDate.to,
              "yyyy-MM-dd'T'23:59:59"
            ).toString(),
          }),
        ...(id && id.trim() && { sas_eq: id }),
      };

      return AutomationModel.getAutomations(
        searchText,
        limit,
        undefined,
        "timestamp",
        "desc",
        filters
      );
    },
  });
  const automationsTypesQuery = useQuery({
    queryKey: ["automationTypes"],
    queryFn: async () => await AutomationModel.getAutomationTypes("", 9999),
  });

  if (automationsQuery.data && "error" in automationsQuery.data)
    return (
      <ErrorMessage errorMessage={automationsQuery.data as IErrorMessage} />
    );

  if (automationsQuery.error || automationsTypesQuery.error) {
    const error: IErrorMessage = {
      code: "500",
      error: "Internal server error",
      message: "Server responded with undefined",
    };
    return <ErrorMessage errorMessage={error}></ErrorMessage>;
  }

  // Data joining logic
  let automationsWithTypes = null;

  if (!(automationsQuery.isLoading || automationsTypesQuery.isLoading)) {
    automationsWithTypes = (automationsQuery.data as IAutomation[]).map(
      (automation: IAutomation) => {
        const matchedType = Array.isArray(automationsTypesQuery.data)
          ? automationsTypesQuery.data.find(
              (type: IAutomationType) => type.type === automation.type
            )
          : null;
        return { ...automation, type_object: matchedType || null };
      }
    );
  }

  // const timeVals: ISelectItem[] = [
  //   { value: "2y", content: "2y" },
  //   { value: "1y", content: "1y" },
  //   { value: "6m", content: "6m" },
  //   { value: "3m", content: "3m" },
  //   { value: "1m", content: "1m" },
  //   { value: "14d", content: "14d" },
  //   { value: "7d", content: "7d" },
  // ];

  return (
    <>
      <div>
        {isNav && (
          <div className="flex justify-between gap-4 mb-4">
            <SearchBar
              searchText={searchText ?? ""}
              setSearchText={setSearchText}
            />
            <div className="flex">
              <DateRangePicker
                dateRange={searchDate}
                setSearchDate={setSearchDate}
              />
            </div>
          </div>
        )}
        {automationsQuery.isLoading || automationsTypesQuery.isLoading ? (
          <Throbber />
        ) : (
          <AutomationsTable
            automations={automationsWithTypes as IAutomation[]}
            searchText={searchText}
          />
        )}
      </div>
    </>
  );
}
