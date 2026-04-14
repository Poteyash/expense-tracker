import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Chart({ data }) {

  if (!data || typeof data !== "object") {
    return <p className="text-gray-400">No analytics data</p>;
  }

  const getMeta = (category) => {
    if (!category) return { icon: "📦", color: "#888" };

    const name = category.toLowerCase();

    if (name.includes("food")) return { icon: "🍔", color: "#22c55e" };
    if (name.includes("petrol")) return { icon: "⛽", color: "#f59e0b" };
    if (name.includes("shopping")) return { icon: "🛍️", color: "#3b82f6" };
    if (name.includes("travel")) return { icon: "✈️", color: "#a855f7" };

    return { icon: "📦", color: "#888" };
  };

  let chartData = [];

  if (data.income || data.expense) {

    if (data.expense) {
      Object.keys(data.expense).forEach((key) => {
        chartData.push({
          name: key,
          value: Number(data.expense[key]) || 0,
          ...getMeta(key),
        });
      });
    }

    if (data.income) {
      Object.keys(data.income).forEach((key) => {
        chartData.push({
          name: key,
          value: Number(data.income[key]) || 0,
          icon: "💰",
          color: "#22c55e",
        });
      });
    }
  }

  if (!chartData.length) {
    return <p className="text-gray-400">No analytics data</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-full">

      {/* 🔥 CHART WITH FADE ANIMATION */}
      <div className="w-full lg:w-1/2 h-full min-h-[250px] animate-fadeIn">

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>

            <Pie
              data={chartData}
              dataKey="value"
              innerRadius={60}
              outerRadius={90}
              isAnimationActive={true}   // 🔥 IMPORTANT
              animationDuration={800}   // 🔥 SMOOTH
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color || "#888"} />
              ))}
            </Pie>

            <Tooltip formatter={(v) => `₹${v}`} />

          </PieChart>
        </ResponsiveContainer>

      </div>

      {/* 🔥 LEGEND WITH HOVER ANIMATION */}
      <div className="w-full lg:w-1/2 space-y-3">

        {chartData.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-white/5 p-3 rounded-lg 
                       hover:bg-white/10 hover:scale-105 transition duration-300"
          >
            <div className="flex gap-2 items-center">
              <span>{item.icon}</span>
              <span className="capitalize">{item.name}</span>
            </div>

            <span>₹{item.value}</span>
          </div>
        ))}

      </div>

    </div>
  );
}