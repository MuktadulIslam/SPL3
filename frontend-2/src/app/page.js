"use client"
import Background from "@/components/AppBackground";
import Sidebar from "@/components/Sidebar";

export default function Page() {
  const hideSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('w-72')
    sidebar.classList.add('w-0')
  }
  const openSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('w-0')
    sidebar.classList.add('w-72')
  }
  return (<>
    <div className="w-screen h-dvh flex flex-row bg-[#111827] text-[#e3f1f9]">
      <div id="sidebar" className={`w-0 h-screen lg:w-1/3 max-w-[310px] transition-all duration-300 max-lg:fixed z-50 overflow-hidden`}>
        <Sidebar />
      </div>
      <div className="w-2/3 flex-1 h-full overflow-y-auto">
        <Background hideSidebar={hideSidebar} openSidebar={openSidebar} />
      </div>
    </div>
  </>)
}