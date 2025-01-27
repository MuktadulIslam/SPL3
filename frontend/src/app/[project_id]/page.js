"use client"
import { Acme } from "next/font/google";
import { useState } from "react";

const acme = Acme({
    weight: ['400'],
    style: ["normal"],
    subsets: ["latin"]
})

export default function Page() {
    const [responseData, setResponseData] = useState(null);
    const [methodName, setMethodName] = useState(null);
    const [methodAccuracy, setMethodAccuracy] = useState(null);
    const [responseDataHeader, setResponseDataHeader] = useState(null);
    const [projectName, setProjectName] = useState("Online Doctor");
    const [isEditing, setIsEditing] = useState(false);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const validateAndSaveName = (newName) => {
        const trimmedName = newName.trim();
        if (trimmedName === '') {
            setProjectName("Unknown Project");
        } else {
            setProjectName(trimmedName);
        }
        setIsEditing(false);
    };

    const handleBlur = () => {
        validateAndSaveName(projectName);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            validateAndSaveName(projectName);
        }
    };

    return (<>
        <div className="w-full h-auto px-2 py-3 2md:px-4 lg:py-4 bg-transparent border md:border-2 border-[#374151] rounded-lg 2md:rounded-xl">
            <div className={`${acme.className} text-base md:text-lg mb-1.5 text-[#91b9fd] space-y-2 md:space-y-3`}>
                <div className="w-full h-auto flex flex-row items-center gap-3 md:gap-5 min-w-0">
                    <div className="flex-shrink-0">Project Name:</div>
                    {isEditing ? (
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            className="flex-1 min-w-0 bg-gray-700 text-gray-100 px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                    ) : (
                        <div 
                            onDoubleClick={handleDoubleClick}
                            className="flex-1 min-w-0 text-gray-100 cursor-pointer hover:bg-gray-700 px-2 py-1 rounded truncate"
                        >
                            {projectName}
                        </div>
                    )}
                </div>
                <div className="w-full h-auto flex flex-row items-center gap-3 md:gap-5">
                    <div className="flex-shrink-0">Target File:</div>
                    <div className="text-gray-100">defectlens.csv</div>
                </div>
                <div className="w-full h-auto flex flex-row items-center gap-3 md:gap-5">
                    <div className="flex-shrink-0">Training File:</div>
                    <div className="text-gray-100">defectlensTraining.csv</div>
                </div>
                <div className="w-full h-auto flex flex-row items-center gap-3 md:gap-5">
                    <div className="flex-shrink-0">Classifier Method Name:</div>
                    <div className="text-gray-100">K-Means</div>
                </div>
                <div className="w-full h-auto flex flex-row items-center gap-3 md:gap-5">
                    <div className="flex-shrink-0">TransferL Method Name:</div>
                    <div className="text-gray-100">Binary Tree</div>
                </div>
                <div className="w-full h-auto flex flex-row items-center gap-3 md:gap-5">
                    <div className="flex-shrink-0">Date:</div>
                    <div className="text-gray-100"> 13:32:00, 30 January, 2025</div>
                </div>
            </div>
        </div>

        {/* Output */}
        {responseData && (
            <>
                <div className="w-full max-h-[1000px] flex bg-transparent border md:border-2 border-[#374151] rounded-lg 2md:rounded-xl overflow-hidden">
                    <div className="w-full h-auto px-2 py-3 2md:px-4 2md:py-6 shadow-md rounded-lg 2md:rounded-xl">
                        <div className="h-auto w-full text-xl 2md:text-2xl font-bold mb-3 2md:mb-4">
                            <p className='w-auto'>File Metrics</p>
                            <div className="text-base 2md:text-lg 2md:flex 2md:flex-row gap-4">
                                <p>{`[Method Name: ${methodName}`}</p>
                                <button onClick={() => downloadResult()}><span className='underline text-blue-600'>Download the .xlsx file</span>{" ]"}</button>
                            </div>

                            {methodAccuracy != null &&
                                <div className='text-base 2md:text-lg'>
                                    Method Accuracy: {methodAccuracy}
                                </div>}
                        </div>
                        <div className="w-full h-full overflow-x-auto pb-6">
                            <DataTable attributesData={responseData} attributesDataHeader={responseDataHeader} />
                        </div>
                    </div>
                </div>
            </>
        )}
    </>)
}