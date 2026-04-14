import { Home, PlusCircle, List, BarChart2, LogOut } from "lucide-react";

export default function Sidebar({ onLogout, open, setOpen }) {

  // 🔥 SCROLL FUNCTION
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setOpen(false); // close sidebar on mobile
    }
  };

  const menu = [
    { label: "Dashboard", icon: <Home size={20} />, id: "dashboard" },
    { label: "Analytics", icon: <BarChart2 size={20} />, id: "analytics" },
    { label: "Add", icon: <PlusCircle size={20} />, id: "add" },
    { label: "Transactions", icon: <List size={20} />, id: "transactions" },
  ];

  return (
    <>
      {/* 🔥 OVERLAY (MOBILE) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🔥 SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black border-r border-white/10 p-5 z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >

        {/* LOGO */}
        <h1 className="text-white text-2xl font-bold mb-8 tracking-wide">
          💰 Finance
        </h1>

        {/* MENU */}
        <div className="space-y-3">

          {menu.map((item, i) => (
            <div
              key={i}
              onClick={() => scrollTo(item.id)}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-gray-400 hover:bg-white/10 hover:text-white transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}

        </div>

        {/* LOGOUT */}
        <button
          onClick={onLogout}
          className="absolute bottom-6 left-5 w-[85%] bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg flex justify-center items-center gap-2 transition"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>
    </>
  );
}