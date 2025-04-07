import Image from "next/image";

export default function Sidebar() {
    return (
        <div className="min-w-48 p-4 flex flex-col h-full pt-8">
            {/* profile button */}
            <div className="relative">
                <button className="flex flex-row gap-4 text-sm px-3 py-1 items-center rounded-md w-full bg-gray-700">
                    <span className="sr-only text-sm">Profile</span>
                    <div className="relative h-8 w-8 rounded-full overflow-hidden">
                        <Image
                            src={"/images/profile.png"}
                            alt="Profile"
                            fill
                        />
                    </div>
                    Euael Eshete
                </button>

                <div className="hidden absolute top-12 w-full bg-gray-800 rounded-md overflow-hidden shadow-lg">
                    <button className="block px-4 py-2 hover:bg-gray-700 w-full text-left">Settings</button>
                    <button className="block px-4 py-2 hover:bg-gray-700 w-full text-left">Logout</button>
                </div>
            </div>
            {/* Time of day selections */}
            <div className="flex flex-col">
                <ul>
                    <li>All day</li>
                    <li>morning</li>
                    <li>afternoon</li>
                    <li>evening</li>
                </ul>
            </div>
            {/* Areas */}
            <div className="flex flex-col">
                <div className="flex flex-row justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-slate-200">Areas</h2>
                </div>
                <ul className="max-h-32 overflow-y-auto">
                    <li>Area 1</li>
                    <li>Area 2</li>
                    <li>Area 3</li>
                </ul>
                <div className="flex flex-row justify-between items-center mt-2">
                    <button className="text-sm text-slate-400 hover:text-slate-200">Add</button>
                </div>
            </div>
            {/* Preferences */}
            <div className="flex flex-col">
                <div className="flex flex-row justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-slate-200">Preference</h2>
                </div>
                <ul className="max-h-32 overflow-y-auto">
                    <li>setting 1</li>
                    <li>setting 2</li>
                    <li>setting 3</li>
                </ul>
            </div>
        </div>
    )
}