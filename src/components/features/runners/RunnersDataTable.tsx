import { useInfiniteQuery } from "@tanstack/react-query";
import RunnersTable from "@/components/features/runners/RunnersTable";
import { useState } from "react";
import SearchBar from "@/components/ui/table/SearchBar";
import { IRunner } from "../../../lib/types/IRunner";
import { Button } from "@/components/ui/Button";
import SelectInput, { ISelectItem } from "@/components/SelectInput";
import { RunnerModel } from "@/lib/models/RunnerModel";
import { IErrorMessage } from "@/lib/types/IErrorMessage";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { ButtonSort } from "@/components/ButtonSort";
import TableFilterNav from "@/components/ui/table/table_filter_nav";
import {
  actionsVals,
  statesVals,
} from "@/components/ui/table/Select_items_list";
import { useSearchParams } from "react-router-dom";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { useTranslation } from "react-i18next";

export default function RunnersPage({
  limit2 = 25,
  isNav = true,
}: {
  limit2: number | undefined;
  isNav: boolean;
}) {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState(searchParams.get("text") || "");
  const [searchAction, setSearchAction] = useState(
    searchParams.get("action") || ""
  );
  const [searchState, setSearchState] = useState(
    searchParams.get("state") || ""
  );
  const [limit] = useState(limit2);
  const [sort, setSort] = useState({
    column: searchParams.get("sort"),
    direction: searchParams.get("order") || "asc",
  });

  const dataQuery = useInfiniteQuery({
    queryKey: [
      "runners",
      {
        search: searchText,
        limit: limit,
        searchAction: searchAction,
        searchState: searchState,
        sort: sort,
      },
    ],
    queryFn: ({ pageParam = 1 }) => {
      const idRegex = "[a-zA-Z0-9]{5}";
      const filters = {
        ...(searchAction &&
          searchAction.trim() !== "" && {
            id_like: `${searchAction}-${idRegex}`,
          }),
        ...(searchState &&
          searchState.trim() !== "" && { state_eq: searchState }),
      };

      return RunnerModel.getRunners(
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

  if (dataQuery.data && "error" in dataQuery.data)
    return (
      <ErrorMessage errorMessage={dataQuery.data.error as IErrorMessage} />
    );

  if (dataQuery.error) {
    const error: IErrorMessage = {
      code: "500",
      error: "Internal server error",
      message: "Server responded with undefined",
    };
    return <ErrorMessage errorMessage={error}></ErrorMessage>;
  }

  let allData: IRunner[] = [];
  dataQuery.data?.pages.forEach((page) => {
    if (Array.isArray(page)) {
      allData = allData.concat(page);
    } else {
      console.error("Unexpected response format:", page);
    }
  });

  const cols: ISelectItem[] = [
    { value: "id", content: t("translation:filters:name_sort") },
  ];

  return (
    <>
      {isNav && (
        <TableFilterNav
          left={
            <SearchBar searchText={searchText} setSearchText={setSearchText} />
          }
          right={
            <>
              <SelectInput
                placeholder={t("translation:filters:action_placeholder")}
                defaultValue={searchAction}
                items={actionsVals(t)}
                onValueChange={(e) => setSearchAction(e)}
                param="action"
              />
              <SelectInput
                placeholder={t("translation:filters:state_placeholder")}
                defaultValue={searchState}
                items={statesVals(t)}
                onValueChange={(e) => setSearchState(e)}
                param="state"
              />
              <ButtonSort sort={sort} setSort={setSort} items={cols} />
            </>
          }
        />
      )}
      {dataQuery.isLoading ? (
        <LoadingSkeleton />
      ) : (
        <div>
          <RunnersTable
            runners={dataQuery.data?.pages}
            searchText={searchText}
          />
          {isNav &&
            dataQuery.data &&
            (
              dataQuery.data?.pages[
                dataQuery.data.pageParams.length - 1
              ] as IRunner[]
            ).length >= limit2 && (
              <div className="w-full mt-4">
                <Button
                  variant="outline"
                  onClick={() => dataQuery.fetchNextPage()}
                  className={`w-full`}
                  disabled={
                    !dataQuery.hasNextPage || dataQuery.isFetchingNextPage
                  }
                >
                  {dataQuery.isFetchingNextPage
                    ? t("translation:common:more_btn_loading")
                    : dataQuery.hasNextPage
                    ? t("translation:common:more_btn_text")
                    : t("translation:common:more_btn_error")}
                </Button>
              </div>
            )}
        </div>
      )}
    </>
  );
}
