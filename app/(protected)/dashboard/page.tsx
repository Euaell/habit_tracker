import Sidebar from "@/components/Sidebar";

export default function Page() {
    return (
        <div className="flex flex-row h-screen w-screen bg-gradient-to-b from-slate-900 to-slate-800">
            <Sidebar />
            <div className="flex flex-col w-full h-full bg-slate-800">
                <div className="flex flex-row h-12 justify-between items-center bg-slate-900 mb-4 drop-shadow-2xl p-4">
                    Header
                </div>

                <div className="flex-grow overflow-y-auto overflow-x-hidden mt-4 p-4 ">
                    {/* Content goes here */}
                    Content
                </div>
            </div>

            <div className="flex flex-col w-sm h-full bg-slate-900 p-4">
                {/* Right sidebar content goes here */}
                Right Sidebar Content
            </div>
        </div>
    )
}