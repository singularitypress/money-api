import { ResponsiveStream } from "@nivo/stream";

export const StreamChart = ({
  data,
  keys,
  gridXValues,
}: {
  data: { [key: string]: number }[];
  keys: string[];
  gridXValues: string[];
}) => (
  <ResponsiveStream
    data={data}
    keys={keys}
    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "",
      legendOffset: 36,
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "",
      legendOffset: -40,
    }}
    enableGridX={true}
    enableGridY={false}
    curve="cardinal"
    offsetType="silhouette"
    colors={{
      datum: "color",
    }}
    gridXValues={gridXValues}
    fillOpacity={0.85}
    borderColor={{ theme: "background" }}
    defs={[
      {
        id: "dots",
        type: "patternDots",
        background: "inherit",
        color: "#2c998f",
        size: 4,
        padding: 2,
        stagger: true,
      },
      {
        id: "squares",
        type: "patternSquares",
        background: "inherit",
        color: "#e4c912",
        size: 6,
        padding: 2,
        stagger: true,
      },
    ]}
    legends={[
      {
        anchor: "bottom-right",
        direction: "column",
        translateX: 100,
        itemWidth: 80,
        itemHeight: 20,
        itemTextColor: "#999999",
        symbolSize: 12,
        symbolShape: "circle",
        effects: [
          {
            on: "hover",
            style: {
              itemTextColor: "#000000",
            },
          },
        ],
      },
    ]}
  />
);
