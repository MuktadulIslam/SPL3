"use client"
import { Rubik_Vinyl, PT_Serif } from "next/font/google";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/app/AppBackground";
import { useRouter } from 'next/navigation';
import Link from "next/link";

const rubik_vinyl = Rubik_Vinyl({
    weight: ['400'],
    style: ["normal"],
    subsets: ["latin"]
});

const pt_serif = PT_Serif({
    weight: ['400'],
    style: ['italic'],
    subsets: ["latin"]
});

export default function Sidebar() {
    const [editingIndex, setEditingIndex] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const { user, logOut, reloadSideBar } = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
        fetch("http://localhost:8000/user_projects")
            .then(response => response.json())
            .then(data => {
                setPredictions(data.history.reverse().map(item => ({
                    name: item.project_name,
                    time: item.submitted_at,
                    project_hash: item.project_hash
                })));
            })
            .catch(error => console.error("Error fetching prediction history:", error));
    }, [reloadSideBar]);

    const handleDoubleClick = (index) => {
        setEditingIndex(index);
    };

    const handleSave = (index, name) => {
        const trimmedName = name.trim();
        const finalName = trimmedName === '' ? 'Unknown Project' : trimmedName;
        const newPredictions = [...predictions];
        newPredictions[index] = { ...newPredictions[index], name: finalName };
        setPredictions(newPredictions);
        setEditingIndex(null);
    };

    const handleBlur = (index, name) => {
        handleSave(index, name);
    };

    const handleKeyDown = (e, index, name) => {
        if (e.key === 'Enter') {
            handleSave(index, name);
        }
    };

    const handleChange = (index, newName) => {
        const newPredictions = [...predictions];
        newPredictions[index] = { ...newPredictions[index], name: newName };
        setPredictions(newPredictions);
    };

    return (
        <div className={`w-full h-full bg-gradient-to-b from-black to-[#003760]`}>
            <div className="w-full h-full flex flex-col gap-2 px-2.5 pb-2 lg:pt-4">
                <div className="w-full h-[3.5rem] sm:h-16 flex flex-row items-center justify-start gap-1 mb-3">
                    <div className="h-9 sm:h-10 aspect-square">
                        <img src="/icon.png" alt="" className="w-full h-full" />
                    </div>
                    <a href="/" className={`${rubik_vinyl.className} h-auto flex-1 text-[30px] sm:text-[35px] font-bold text-white`}>
                        DefectLens
                    </a>
                </div>

                <button onClick={() => router.push('/')} className="w-full h-8 rounded-md border-2 border-gray-300 flex justify-center items-center text-sm mb-2">New Project</button>

                {user && (
                    <>
                        <div className="w-full flex-1 flex flex-col gap-2 overflow-y-auto">
                            <div className="w-full font-medium text-sm underline mb-0.5">Previous Predictions</div>
                            <div className="w-full flex-1 relative flex flex-col gap-1 pr-2">
                                {predictions.map((prediction, index) => (
                                    <Link href={`/${prediction.project_hash}`} key={index} className="h-12">
                                        <p className="text-xs leading-3 text-gray-500">{prediction.time}</p>
                                        {editingIndex === index ? (
                                            <input
                                                type="text"
                                                value={prediction.name}
                                                onChange={(e) => handleChange(index, e.target.value)}
                                                onBlur={() => handleBlur(index, prediction.name)}
                                                onKeyDown={(e) => handleKeyDown(e, index, prediction.name)}
                                                className="w-full px-1 py-0.5 text-base border border-blue-500 rounded focus:outline-none focus:border-blue-600"
                                                autoFocus
                                            />
                                        ) : (
                                            <p className="truncate text-base cursor-pointer hover:text-gray-700" onDoubleClick={() => handleDoubleClick(index)}>
                                                {prediction.name}
                                            </p>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="w-full h-8 flex items-center justify-start gap-2 relative group z-50">
                            <div className="h-full aspect-square">
                                <img src={user?.photoURL} alt="user_img" className="w-full h-full rounded-full" />
                            </div>
                            <div className={`${pt_serif.className} text-lg`}>{user?.name}</div>
                            <button onClick={logOut} className="absolute top-0 left-0 h-0 group-hover:h-10 group-hover:-top-12 w-full -z-10 bg-red-600 text-white text-base 2md:text-lg font-semibold rounded-md flex justify-center items-center overflow-hidden transition-all duration-300">
                                <span>Log Out</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}