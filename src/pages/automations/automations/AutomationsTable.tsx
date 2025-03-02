import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table/table";
import { IErrorMessage } from "@/lib/types/IErrorMessage";
import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/Button";
import Table_cel_title from "@/components/ui/table/table_cel_title";
import { Badge_timeAgo } from "@/components/ui/table/badge_timeAgo";
import StateNode, { NodeColor, NodeDirection } from "@/components/Node";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IAutomation } from "@/lib/types/IAutomation";
import { badgeVariants } from "@/lib/types/IBadgeProps";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/lib/hooks/use-mobile";

interface IProps {
  automations: IAutomation[] | IErrorMessage;
  searchText?: string;
}

export default function AutomationsTable(props: IProps) {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  if (props.automations === undefined || props.automations === null)
    return <h1>Error at data joining</h1>;
  const getNodeProps = (
    currentIndex: number,
    activeIndex: number,
    totalStates: number
  ) => {
    const props = {
      isBorder: false,
      isActive: false,
      color: "gray" as NodeColor,
      direction:
        currentIndex === totalStates - 1
          ? ("none" as NodeDirection)
          : ("right" as NodeDirection),
    };

    // If the last node is active, make all nodes green
    if (activeIndex === totalStates - 1) {
      props.color = "green";
      props.isActive = currentIndex === activeIndex;
      return props;
    }

    if (activeIndex === -1) {
      // no matching state
      props.color = "gray";
      props.isBorder = true;
      return props;
    }

    if (currentIndex < activeIndex) {
      props.color = "gray";
    } else if (currentIndex > activeIndex) {
      props.color = "gray";
      props.isBorder = true;
    } else if (currentIndex === activeIndex) {
      // Change color to green if it's the last state, otherwise yellow
      props.color = "yellow";
      props.isActive = true;
    } else {
      props.color = "gray";
    }

    return props;
  };

  return (
    <Table className="overflow-x-auto">
      <TableBody>
        {(props.automations as IAutomation[]).map(
          (a: IAutomation, index: number) => {
            const activeIndex = a.type_object?.states.indexOf(a.state) ?? -1;

            let isStateWrong = false;
            if (activeIndex === -1) isStateWrong = true;

            return (
              <TableRow key={`${a.id}-${index}`}>
                <TableCell>
                  <div
                    className={`flex flex-wrap  h-full gap-3 ${
                      isMobile
                        ? "flex-col gap-2 items-start justify-start"
                        : "items-center justify-between"
                    }`}
                  >
                    <div>
                      <div className="flex justify-start">
                        <Table_cel_title
                          title={a.id.slice(-5)}
                          text={a.id.slice(0, -6).toLowerCase()}
                          searchText={props.searchText}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-col justify-center">
                        <div className="flex justify-center">
                          {a.type_object?.states?.map((state, index) => {
                            const nodeProps = getNodeProps(
                              index,
                              activeIndex,
                              a.type_object?.states?.length ?? 0
                            );
                            return (
                              <TooltipProvider key={index}>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <StateNode {...nodeProps} />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{state}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            );
                          })}
                        </div>
                        {isStateWrong ? (
                          <span className="text-center text-muted-foreground">
                            {`(${a.state.toLowerCase()})`}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div>
                      <Badge_timeAgo date={new Date(a.last_activity)} />
                      <span> {t("translation:common:on")} </span>
                      <Link
                        to={`/projects/${a.sas}`}
                        className={badgeVariants({ variant: "outline" })}
                      >
                        {a.sas.slice(4)}
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-end">
                  <Link
                    className={buttonVariants({ variant: "outline" })}
                    to={`/projects/${a.sas}/automations/${a.id}`}
                  >
                    {t("translation:projects:logs_btn")}
                  </Link>
                </TableCell>
              </TableRow>
            );
          }
        )}
      </TableBody>
    </Table>
  );
}
