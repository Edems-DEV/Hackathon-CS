import { AutomationModel } from "@/lib/models/AutomationModel";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import AutomationsTable from "@/pages/automations/automations/AutomationsTable";
import { IErrorMessage } from "@/lib/types/IErrorMessage";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { IAutomationType } from "../../../lib/types/IAutomationType";
import { IAutomation } from "@/lib/types/IAutomation";
import SearchBar from "@/components/ui/table/SearchBar";
import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import DateRangePicker from "@/components/ui/table/DateRangePicker";
import { ButtonSort } from "@/components/ButtonSort";
import TableFilterNav from "@/components/ui/table/table_filter_nav";
import { ISelectItem } from "@/components/SelectInput";
import { Button } from "@/components/ui/Button";
import { useSearchParams } from "react-router-dom";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { useTranslation } from "react-i18next";

export default function AutomationsDataTable({
  limit = 25,
  isNav = true,
  id,
}: {
  limit: number | undefined;
  isNav: boolean | undefined;
  id?: string;
}) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("text") || "");

  const [searchDate, setSearchDate] = useState<DateRange | undefined>({
    from: searchParams.get("from")
      ? new Date(searchParams.get("from"))
      : undefined,
    to: searchParams.get("to") ? new Date(searchParams.get("to")) : undefined,
  });
  const [sort, setSort] = useState({
    column: searchParams.get("sort") || "",
    direction: searchParams.get("order") || "asc",
  });

  const automationsQuery = useInfiniteQuery({
    queryKey: [
      "automation",
      { searchText: searchText, searchDate: searchDate, sort: sort },
    ],
    queryFn: ({ pageParam = 1 }) => {
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
        pageParam,
        sort.column,
        sort.direction,
        filters
      );
    },
    initialPageParam: 1,
    getNextPageParam: (_, __, lastPageParam) => {
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_, __, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });
  const automationsTypesQuery = useQuery({
    queryKey: ["automationTypes"],
    queryFn: async () =>
      await AutomationModel.getAutomationTypes(undefined, 9999),
  });

  if (automationsQuery.data && "error" in automationsQuery.data)
    return (
      <ErrorMessage
        errorMessage={automationsQuery.data.error as IErrorMessage}
      />
    );

  if (automationsQuery.error || automationsTypesQuery.error) {
    const error: IErrorMessage = {
      code: "500",
      error: "Internal server error",
      message: "Server responded with undefined",
    };
    return <ErrorMessage errorMessage={error}></ErrorMessage>;
  }

  let allData: IAutomation[] = [];
  automationsQuery.data?.pages.forEach((page) => {
    if (Array.isArray(page)) {
      allData = allData.concat(page);
    } else {
      console.error("Unexpected response format:", page);
    }
  });

  // Data joining logic
  let automationsWithTypes = null;

  if (!(automationsQuery.isLoading || automationsTypesQuery.isLoading)) {
    automationsWithTypes = (allData as IAutomation[]).map(
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

  const cols: ISelectItem[] = [
    { value: "id", content: "ID" },
    { value: "last_activity", content: t("translation:filters:date_sort") },
  ];

  return (
    <>
      <div>
        {isNav && (
          <TableFilterNav
            left={
              <SearchBar
                searchText={searchText ?? ""}
                setSearchText={setSearchText}
              />
            }
            right={
              <>
                <DateRangePicker
                  dateRange={searchDate}
                  setSearchDate={setSearchDate}
                />
                <ButtonSort sort={sort} setSort={setSort} items={cols} />
              </>
            }
          />
        )}
        {automationsQuery.isLoading || automationsTypesQuery.isLoading ? (
          <LoadingSkeleton />
        ) : (
          <AutomationsTable
            automations={automationsWithTypes as IAutomation[]}
            searchText={searchText}
          />
        )}
        {isNav &&
          automationsQuery.data &&
          (
            automationsQuery.data?.pages[
              automationsQuery.data.pageParams.length - 1
            ] as IAutomation[]
          ).length >= limit && (
            <div className="w-full mt-4">
              <Button
                variant="outline"
                onClick={() => automationsQuery.fetchNextPage()}
                className="w-full"
                disabled={
                  !automationsQuery.hasNextPage ||
                  automationsQuery.isFetchingNextPage
                }
              >
                {automationsQuery.isFetchingNextPage
                  ? t("translation:common:more_btn_loading")
                  : automationsQuery.hasNextPage
                  ? t("translation:common:more_btn_text")
                  : t("translation:common:more_btn_error")}
              </Button>
            </div>
          )}
      </div>
    </>
  );
}
