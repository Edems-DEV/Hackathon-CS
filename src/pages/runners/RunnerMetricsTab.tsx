import CustomLineChart from "@/components/features/charts/CustomLineChart";
import { IMetrics } from "../metrics/types/IMetrics";
import CustomAreaChart from "@/components/features/charts/CustomAreaChart";

interface ICPUMetrics {
  point: string;
  percents: number;
}

interface IIncomingMetrics {
  point: string;
  recieve: number;
  write: number;
}

interface IOutgoingMetrics {
  point: string;
  read: number;
  transmit: number;
}

interface IProps {
  runnerMetrics: IMetrics;
}

const CPU_CHART_CONFIG = {
  percents: {
    label: "Percents",
    color: "hsl(var(--chart-1))",
  },
};

const INCOMING_CHART_CONFIG = {
  recieve: {
    label: "Recieve MB/s",
    color: "hsl(var(--chart-1))",
  },
  write: {
    label: "Writes MB/s",
    color: "hsl(var(--chart-2))",
  },
};

const OUTGOING_CHART_CONFIG = {
  read: {
    label: "Reads MB/s",
    color: "hsl(var(--chart-1))",
  },
  transmit: {
    label: "Transmits MB/s",
    color: "hsl(var(--chart-2))",
  },
};

export default function RunnerMetricsTab(props: IProps) {
  if (props.runnerMetrics === null) return <div>Missing data</div>;

  const cpuMetrics = createCpuData(props.runnerMetrics);
  const incomingData = createNetworkData(props.runnerMetrics);
  const outgoingData = createFsData(props.runnerMetrics);

  console.log(cpuMetrics.length);
  console.log(incomingData.length);
  console.log(outgoingData.length);

  if (
    cpuMetrics.length == 0 &&
    incomingData.length == 0 &&
    outgoingData.length == 0
  ) {
    return (
      <div className="font-bold text-[30px] mt-5">
        Metriky nejsou k dispozici
      </div>
    );
  }

  return (
    <div className="grid grid-rows-2 gap-4 auto-rows-max grid-cols-2 mt-5">
      {/* <RunnerMetricsGridCell heading="CPU"> */}
      <CustomLineChart
        chartConfig={CPU_CHART_CONFIG}
        chartData={cpuMetrics}
        dataKey="point"
        lineType="step"
        showCursor={true}
      />
      {/* </RunnerMetricsGridCell> */}
      <CustomLineChart
        chartConfig={INCOMING_CHART_CONFIG}
        chartData={incomingData}
        dataKey="point"
        lineType="linear"
        showCursor={true}
      />
      <CustomAreaChart
        chartConfig={OUTGOING_CHART_CONFIG}
        dataKey="point"
        lineType="natural"
        showCursor={true}
        chartData={outgoingData}
      />
    </div>
  );
}

function createCpuData(runnerMetrics: IMetrics) {
  let cpuMetrics: ICPUMetrics[] = [];

  if (runnerMetrics?.metrics) {
    runnerMetrics.metrics.forEach((m, i) => {
      cpuMetrics.push({
        point: (runnerMetrics.metrics.length - i).toString(),
        percents: Math.round(m.cpu * 10000) / 100,
      });
    });
  }

  return cpuMetrics;
}

function createNetworkData(runnerMetrics: IMetrics) {
  let incomingMetrics: IIncomingMetrics[] = [];

  if (runnerMetrics?.metrics) {
    runnerMetrics.metrics.forEach((m, i) => {
      incomingMetrics.push({
        point: (runnerMetrics.metrics.length - i).toString(),
        recieve: Math.round(m.network_receive / 64),
        write: Math.round(m.fs_writes / 64),
      });
    });
  }

  return incomingMetrics;
}

function createFsData(runnerMetrics: IMetrics) {
  let outgoingMetrics: IOutgoingMetrics[] = [];

  if (runnerMetrics?.metrics) {
    runnerMetrics.metrics.forEach((m, i) => {
      outgoingMetrics.push({
        point: (runnerMetrics.metrics.length - i).toString(),
        read: Math.round(m.fs_reads / 64),
        transmit: Math.round(m.network_transmit / 64),
      });
    });
  }

  return outgoingMetrics;
}
