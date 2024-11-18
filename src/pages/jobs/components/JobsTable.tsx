import { IJobs } from "@/pages/jobs/types/IJobs";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  // TableCaption,
  // TableHead,
  // TableHeader,
} from "@/components/ui/table/table";
import { IErrorMessage } from "@/lib/types/IErrorMessage";
import { Link } from "react-router-dom";
import { badgeVariants } from "@/components/ui/badge";
import { Table_cel_state } from "@/components/ui/table/table_cel_state";
import Table_cel_title from "@/components/ui/table/table_cel_title";

interface IProps {
  jobs: IJobs[] | IErrorMessage;
}

export default function JobsTable(props: IProps) {
  return (
    <Table>
      {/* <TableHeader>
        <TableRow>
          <TableHead className="w-[200px] text-white">Id</TableHead>
          <TableHead className="text-white">Status</TableHead>
          <TableHead className="text-white">Info</TableHead>
        </TableRow>
      </TableHeader> */}
      <TableBody>
        {(props.jobs as IJobs[]).map((j) => (
          <TableRow key={j.id}>
            <TableCell className="font-medium">
              <Table_cel_title
                title={j.id}
                text={buildDescription(parseRunnerAction(j.runner))}
              />
            </TableCell>
            <JobCells {...j} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function JobCells(job: IJobs) {
  const action = parseRunnerAction(job.runner);
  return (
    <>
      <TableCell>
        <Table_cel_state
          title={job.state}
          text={job.timestamp}
          type={job.state}
        />
      </TableCell>
      <TableCell>
        <Link
          to={"#" /*`/jobs/${job.runner}`*/}
          className={badgeVariants({ variant: "outline" })}
        >
          {job.SAS.toUpperCase().slice(4)}
        </Link>
        <span>{tagJoin({ action, state: job.state })}</span>
        {action !== RunnerActions.waiting && (
          <Link
            to={`/runners?grp=${job.organization}`}
            className={badgeVariants({ variant: "outline" })}
          >
            {job.runner.slice(job.runner.length - 5).toUpperCase()}
          </Link>
        )}
      </TableCell>
    </>
  );
}

enum RunnerActions {
  waiting = "waiting",
  build = "build",
  test = "test",
  deploy_dev = "deploy_dev",
  deploy_prod = "deploy_prod",
}
enum JobStates {
  queued = "queued",
  in_progress = "in_progress",
  success = "success",
  failed = "failed",
}

export function parseRunnerAction(RunnerId: string) {
  if (RunnerId === "none") return RunnerActions.waiting;
  else if (RunnerId.includes("csas-dev") && RunnerId.includes("csas-linux"))
    return RunnerActions.build;
  else if (
    RunnerId.includes("csas-dev") &&
    RunnerId.includes("csas-linux-test")
  )
    return RunnerActions.test;
  else if (RunnerId.includes("csas-ops") && RunnerId.includes("csas-linux"))
    return RunnerActions.deploy_dev;
  else if (
    RunnerId.includes("csas-ops") &&
    RunnerId.includes("csas-linux-prod")
  )
    return RunnerActions.deploy_prod;
  else return RunnerActions.build; //TODO: FIX it later !!!!!!!!!!!!!!!!!!!!!!!!!

  // throw new Error("Unknown runner ID format");
}

export function buildDescription(action: RunnerActions) {
  switch (action) {
    case RunnerActions.waiting:
      return "Waiting for runner";
    case RunnerActions.build:
      return "Building";
    case RunnerActions.test:
      return "Testing";
    case RunnerActions.deploy_dev:
      return "Deploying to dev";
    case RunnerActions.deploy_prod:
      return "Deploying to prod";
  }
}

const verbMap: { [key in JobStates]: string } = {
  [JobStates.success]: "was",
  [JobStates.in_progress]: "is being",
  [JobStates.queued]: "will be",
  [JobStates.failed]: "failed to be",
};
const actionMap: { [key in RunnerActions]: string } = {
  [RunnerActions.waiting]: "is waiting for runner", //always present tense
  [RunnerActions.build]: "built",
  [RunnerActions.test]: "tested",
  [RunnerActions.deploy_dev]: "deployed to dev",
  [RunnerActions.deploy_prod]: "deployed to prod",
};
export function tagJoin({
  action,
  state,
}: {
  action: RunnerActions;
  state: string;
}): string {
  if (!(state in JobStates)) {
    throw new Error("Unknown job state");
  }
  const actionText = actionMap[action];
  if (action === RunnerActions.waiting) {
    return actionText;
  }
  const verb = verbMap[state as JobStates];
  if (!verb || !actionText) {
    throw new Error("Unknown job state or action");
  }
  return `${verb} ${actionText} by`;
}
