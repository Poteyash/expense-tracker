import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function Graph({ transactions }) {

  if (!transactions || transactions.length === 0) {
    return <p className="text-gray-400">No data</p>;
  }

  // 🔥 SORT BY DATE
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  let balance = 0;

  // 🔥 REAL DATA (NO SCALING)
  const chartData = sorted.map((t, i) => {
    if (t.type === "income") {
      balance += Number(t.amount);
    } else {
      balance -= Number(t.amount);
    }

    return {
      time: i + 1,
      value: balance, // ✅ REAL ₹ VALUE
    };
  });

  // 🔥 CUSTOM TOOLTIP
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white p-2 rounded shadow">
          ₹ {payload[0].value}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">

      <ResponsiveContainer>
        <LineChart data={chartData}>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#222" />
          
          <XAxis dataKey="time" hide />
          
          <YAxis
            tick={{ fill: "#888" }}
            tickFormatter={(value) => `₹${value}`}
          />

          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#22c55e"
            strokeWidth={3}
            dot={false}
            style={{ filter: "drop-shadow(0 0 6px #22c55e)" }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}