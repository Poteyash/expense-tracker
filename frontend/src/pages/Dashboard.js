import { useEffect, useState } from "react";
import API from "../services/api";
import Chart from "../components/Chart";
import Graph from "../components/Graph";
import AddTransaction from "../components/AddTransaction";
import TransactionList from "../components/TransactionList";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {

  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expense: 0,
  });

  const [analytics, setAnalytics] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 🔥 LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  // 🔥 LOAD DATA
  const loadData = async () => {
    try {
      const res1 = await API.get("/transactions/analytics");
      const res2 = await API.get("/transactions");

      const data = res1.data;

      let income = 0;
      let expense = 0;

      Object.values(data.income || {}).forEach(v => income += v);
      Object.values(data.expense || {}).forEach(v => expense += v);

      setSummary({
        balance: income - expense,
        income,
        expense
      });

      setAnalytics(data);
      setTransactions(res2.data);

    } catch (err) {
      console.log("Dashboard Error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [refresh]);

  const triggerRefresh = () => {
    setRefresh(prev => !prev);
  };

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* 🔥 SIDEBAR */}
      <Sidebar
        onLogout={handleLogout}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* 🔥 MAIN */}
      <div className="flex-1 md:ml-64 p-4 md:p-6 space-y-12">

        {/* 🔥 MOBILE HEADER */}
        <div className="flex justify-between items-center md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-2xl"
          >
            ☰
          </button>
          <h1 className="font-bold">Dashboard</h1>
        </div>

        {/* 🔥 SUMMARY */}
        <div
          id="dashboard"   // ✅ FIXED
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >

          <div className="bg-white/5 p-5 rounded-xl border border-white/10 hover:scale-105 transition duration-300">
            <p className="text-gray-400 text-sm">Balance</p>
            <h2 className="text-green-400 text-2xl font-bold">
              ₹{summary.balance}
            </h2>
          </div>

          <div className="bg-white/5 p-5 rounded-xl border border-white/10 hover:scale-105 transition duration-300">
            <p className="text-gray-400 text-sm">Income</p>
            <h2 className="text-blue-400 text-2xl font-bold">
              ₹{summary.income}
            </h2>
          </div>

          <div className="bg-white/5 p-5 rounded-xl border border-white/10 hover:scale-105 transition duration-300">
            <p className="text-gray-400 text-sm">Expense</p>
            <h2 className="text-amber-400 text-2xl font-bold">
              ₹{summary.expense}
            </h2>
          </div>

        </div>

        {/* 🔥 ANALYTICS */}
        <div
          id="analytics"   // ✅ FIXED
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >

          <div className="bg-white/5 p-4 rounded-xl border border-white/10 h-[350px] flex items-center justify-center">
            <Chart data={analytics || {}} />
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10 h-[350px]">
            <Graph transactions={transactions || []} />
          </div>

        </div>

        {/* 🔥 ADD TRANSACTION */}
        <div id="add">  {/* ✅ FIXED */}
          <AddTransaction onAdd={triggerRefresh} />
        </div>

        {/* 🔥 TRANSACTIONS */}
        <div id="transactions">  {/* ✅ FIXED */}
          <TransactionList
            refresh={refresh}
            onUpdate={triggerRefresh}
          />
        </div>

      </div>
    </div>
  );
}