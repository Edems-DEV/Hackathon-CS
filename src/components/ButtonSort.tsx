import {
  ArrowDownAZIcon,
  ArrowDownUpIcon,
  ArrowDownZAIcon,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SelectInput, { ISelectItem } from "./SelectInput";
import { useTranslation } from "react-i18next";

interface SortState {
  column: string;
  direction: string;
}

interface ButtonSortProps {
  sort: SortState;
  setSort: React.Dispatch<React.SetStateAction<SortState>>;
  items: ISelectItem[];
}

export function ButtonSort({ sort, setSort, items }: ButtonSortProps) {
  const directions: ISelectItem[] = [
    { value: "asc", content: <ArrowDownAZIcon /> },
    { value: "desc", content: <ArrowDownZAIcon /> },
  ];

  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {/*  className="ml-auto" */}
          <ArrowDownUpIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <div className="flex flex-col gap-2 p-2">
            <div className="flex flex-col gap-2 p-1">
              <span className="text-sm text-muted-foreground">
                {t("translation:filters:sort_title")}
              </span>
              <SelectInput
                placeholder=""
                defaultValue={sort.column}
                items={items}
                onValueChange={(e) =>
                  setSort((prev) => ({ ...prev, column: e }))
                }
                param="sort"
              />
            </div>
            <div className="flex flex-col gap-2 p-1">
              <span className="text-sm text-muted-foreground">
                {t("translation:filters:order_title")}
              </span>
              <SelectInput
                placeholder=""
                defaultValue={sort.direction}
                items={directions}
                onValueChange={(e) =>
                  setSort((prev) => ({ ...prev, direction: e }))
                }
                param="order"
              />
            </div>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
