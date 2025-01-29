"use client"
import { Acme } from "next/font/google";
import { useEffect, useState } from "react";
import { useMutation } from 'react-query';
import axios from 'axios';
import DataTable from "@/components/DataTable";

const acme = Acme({
    weight: ['400'],
    style: ["normal"],
    subsets: ["latin"]
})

// Mutation function with cancellation token
const fetchPredictionData = async ({ formData, endPoint }) => {
    const response = await axios.post(`http://127.0.0.1:8000/${endPoint}`, formData);
    return response.data;
};

export default function Page({ params }) {
    const [responseData, setResponseData] = useState(null);
    const [responseDataHeader, setResponseDataHeader] = useState(null);

    const [methodName, setMethodName] = useState(null);
    const [submitionTime, setSubmitionTime] = useState(null);
    const [projectType, setProjectType] = useState(null)
    const [projectName, setProjectName] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const { mutate, isLoading, isError, data, error } = useMutation(fetchPredictionData, {
        onSuccess: (data) => {
            setProjectName(data.project_name)
            setMethodName(data.method_name)
            setSubmitionTime(data.submitted_at)
            setProjectType(data.project_type)

            setResponseData(data.data);
            setResponseDataHeader(data.data_header);
        },
        onError: (error) => {
            if (error.response) {
                alert(`Error-${error.response.status}: ${error.response.data.detail}`);
            }
        }
    });

    useEffect(() => {
        const formData = new FormData();
        formData.append("project_hash", params.project_hash);
        mutate({ formData, endPoint: "api/predict/get-projects" });
    }, [params.project_hash, mutate]);

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

    return (
        <>
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
                        <div className="flex-shrink-0">TransferL Method Name:</div>
                        <div className="text-gray-100">{methodName}</div>
                    </div>
                    <div className="w-full h-auto flex flex-row items-center gap-3 md:gap-5">
                        <div className="flex-shrink-0">Project Type:</div>
                        <div className="text-gray-100">{projectType}</div>
                    </div>
                    <div className="w-full h-auto flex flex-row items-center gap-3 md:gap-5">
                        <div className="flex-shrink-0">Date:</div>
                        <div className="text-gray-100"> {submitionTime}</div>
                    </div>
                </div>
            </div>

            {/* Output */}
            {responseData && (
                <div className="w-full max-h-[1000px] flex bg-transparent border md:border-2 border-[#374151] rounded-lg 2md:rounded-xl overflow-hidden">
                    <div className="w-full h-auto px-2 py-3 2md:px-4 2md:py-6 shadow-md rounded-lg 2md:rounded-xl">
                        <div className="h-auto w-full text-xl 2md:text-2xl font-bold mb-3 2md:mb-4">
                            <p className='w-auto'>File Metrics</p>
                            <div className="text-base 2md:text-lg 2md:flex 2md:flex-row gap-4">
                                <p>{`[Method Name: ${methodName}`}</p>
                                <button onClick={() => downloadResult()}><span className='underline text-blue-600'>Download the .xlsx file</span>{" ]"}</button>
                            </div>
                        </div>
                        {isLoading ?
                        <div>Loading....</div> :
                            <div className="w-full h-full overflow-x-auto pb-6">
                                <DataTable attributesData={responseData} attributesDataHeader={responseDataHeader} />
                            </div>
                        }
                    </div>
                </div>
            )}
        </>
    );
}
