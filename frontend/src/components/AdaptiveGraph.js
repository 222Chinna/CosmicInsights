import React, { useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const AdaptiveGraph = ({ data, xKey, yKey }) => {
  const [isCategoricalX, setIsCategoricalX] = useState(false);

  useEffect(() => {
    // Detect if xKey contains string values (i.e. categorical data)
    const isCategorical = typeof data[0]?.[xKey] === "string";
    setIsCategoricalX(isCategorical);
  }, [xKey, data]);

  return (
    <ResponsiveContainer width="100%" height={500}>
      {isCategoricalX ? (
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xKey}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis />
          <Bar dataKey={yKey} fill="#8884d8">
            <LabelList dataKey={yKey} position="top" />
          </Bar>
        </BarChart>
      ) : (
        <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xKey}
            name={xKey}
            type="number"
            domain={["auto", "auto"]}
          />
          <YAxis dataKey={yKey} name={yKey} />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const point = payload[0].payload;
                return (
                  <div
                    style={{
                      background: "black",
                      padding: "6px",
                      borderRadius: "5px",
                      color: "white",
                    }}
                  >
                    <strong>{point.pl_name}</strong>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter name="Planets" data={data} fill="#0b0033" />
        </ScatterChart>
      )}
    </ResponsiveContainer>
  );
};

export default AdaptiveGraph;
