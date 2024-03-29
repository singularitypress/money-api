import React from "react";
import {
  PointMouseHandler,
  PointTooltip,
  ResponsiveLine,
  Serie,
} from "@nivo/line";

const ToolTip: PointTooltip = ({ point }) => {
  return (
    <div
      style={{
        background: "white",
        padding: "9px 12px",
        border: "1px solid #ccc",
      }}
    >
      <strong>{`${point.data.x}`.slice(0, 24)}</strong>
      <br />
      <strong>
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "CAD",
        }).format(Number(point.data.y))}
      </strong>
    </div>
  );
};

export const LineChart = ({
  data,
  onClick,
  xScale = { type: "point" },
  curve = "natural",
}: {
  data: Serie[];
  onClick?: PointMouseHandler;
  xScale?:
    | { type: "point" }
    | {
        type: "time";
        format: string;
        precision: "day" | "month" | "year";
        useUTC: boolean;
      };
  curve?:
    | "natural"
    | "basis"
    | "cardinal"
    | "catmullRom"
    | "linear"
    | "monotoneX"
    | "monotoneY"
    | "step"
    | "stepAfter"
    | "stepBefore";
}) => {
  return (
    <ResponsiveLine
      data={data}
      onClick={onClick}
      colors={[
        "hsl(0, 70%, 50%)",
        "hsl(40, 70%, 50%)",
        "hsl(80, 70%, 50%)",
        "hsl(120, 70%, 50%)",
        "hsl(160, 70%, 50%)",
        "hsl(200, 70%, 50%)",
        "hsl(240, 70%, 50%)",
        "hsl(280, 70%, 50%)",
      ]}
      curve={curve}
      margin={{ top: 50, right: 110, bottom: 100, left: 60 }}
      xScale={xScale}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        reverse: false,
      }}
      animate={true}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 10,
        tickRotation: 45,
        legend: "month",
        legendOffset: 75,
        legendPosition: "middle",
        format: xScale.type === "point" ? undefined : "%Y-%m-%d",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "count",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      tooltip={ToolTip}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};
