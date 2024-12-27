import { Lobster, Rubik_Vinyl, Acme } from "next/font/google";
import { useRef, useState } from "react";
import axios from 'axios';
import { useMutation } from 'react-query';
// import DataTable from './DataTable';
import * as XLSX from 'xlsx';

const rubik_vinyl = Rubik_Vinyl({
    weight: ['400'],
    style: ["normal"],
    subsets: ["latin"]
})
const acme = Acme({
    weight: ['400'],
    style: ["normal"],
    subsets: ["latin"]
})
const lobster = Lobster({
    weight: ['400'],
    style: ["normal"],
    subsets: ["latin"]
})

// Mutation function with cancellation token
const fetchPredictionData = async ({ formData, endPoint, cancelToken }) => {
    const response = await axios.post(`http://127.0.0.1:8000/${endPoint}`, formData, {
        cancelToken: cancelToken.token
    });
    return response.data;
};


export default function Background({ hideSidebar, openSidebar }) {
    const [sidebarOpenStatas, setSidebarOpenStatas] = useState(false);

    const openHistryBar = () => {
        if (sidebarOpenStatas) hideHistryBar();
        else {
            openSidebar();
            setSidebarOpenStatas(true);
        }
    }
    const hideHistryBar = () => {
        hideSidebar();
        setSidebarOpenStatas(false);
    }



    const PREDICTION_BY_COURCE_CODE = "predictionBySourceCode";
    const PREDICTION_BY_ATTRIBUTES = "predictionByattributes";
    const PREDICTION_TO_CHECK_ACCURACY = "predictionToCheckAccuracy";
    const [selectedOption, setSelectedOption] = useState(PREDICTION_BY_COURCE_CODE);

    const sourceFile = useRef(null);
    const targetFile = useRef(null);
    const [responseData, setResponseData] = useState(null);
    const [responseDataHeader, setResponseDataHeader] = useState(null);
    const [methodName, setMethodName] = useState(null);
    const [methodAccuracy, setMethodAccuracy] = useState(null);
    const [cancelToken, setCancelToken] = useState(null); // Store cancel token

    const resetAll = () => {
        document.querySelector('#sourceFileInput').value = '';
        document.querySelector('#targetFileInput').value = '';
        sourceFile.current = null;
        targetFile.current = null;
        setResponseData(null)
        setResponseDataHeader(null)
        setMethodName(null)
        setMethodAccuracy(null)
    }

    const resetResponseData = () => {
        setResponseData(null)
        setResponseDataHeader(null)
        setMethodName(null)
        setMethodAccuracy(null)
    }

    const handleSourceFileInputChange = (event) => {
        event.preventDefault();
        sourceFile.current = event.target.files[0];
        resetResponseData()
    };

    const handleTargetFileInputChange = (event) => {
        event.preventDefault();
        targetFile.current = event.target.files[0];
        resetResponseData()
    };

    const { mutate, isLoading, isError, data, error } = useMutation(fetchPredictionData, {
        onSuccess: (data) => {
            setResponseData(data.data);
            setResponseDataHeader(data.data_header);
            setMethodName(data.method_name);
            setMethodAccuracy(data.accuracy);
        },
        onError: (error) => {
            if (error.response) {
                alert(`Error-${error.response.status}: ${error.response.data.detail}`);
            }
        },
        onSettled: () => {
            // Reset cancel token on request completion (success or error)
            setCancelToken(null);
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        resetResponseData()

        if (sourceFile.current == null || targetFile.current == null) return;

        const formData = new FormData();
        formData.append("source_file", sourceFile.current);
        formData.append("target_file", targetFile.current);

        let endPoint = null;
        if (selectedOption === PREDICTION_BY_COURCE_CODE) endPoint = "api/predict/from-source-code";
        else if (selectedOption === PREDICTION_BY_ATTRIBUTES) endPoint = "api/predict/from-attributes";
        else if (selectedOption === PREDICTION_TO_CHECK_ACCURACY) endPoint = "api/predict/check-accuracy";

        if (endPoint !== null) {
            const sourceCancelToken = axios.CancelToken.source(); // Create a cancel token
            setCancelToken(sourceCancelToken); // Store the cancel token
            mutate({ formData, endPoint, cancelToken: sourceCancelToken }); // Trigger the mutation with the cancel token
        }
    };

    const handelCancel = (event) => {
        event.preventDefault();
        if (cancelToken) {
            cancelToken.cancel("Request was cancelled by the user."); // Cancel the request
        }
        resetAll(); // Reset all form fields and state
    }

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        resetAll()
    };

    const downloadResult = () => {
        // Prepare the data for Excel
        const header = responseDataHeader;
        const data = responseData;

        // Create a new workbook and add a worksheet
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();

        // Add the header row to the worksheet
        XLSX.utils.sheet_add_aoa(ws, [header], { origin: 'A1' });

        // Append the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

        // Generate a file name
        const fileName = 'data.xlsx';

        // Save to file
        XLSX.writeFile(wb, fileName);
    };

    return (<>
        <div className="flex-1 h-full"
            onClick={() => hideHistryBar()}
        >
            <div className="lg:hidden w-full h-[3.5rem] sm:h-16 flex items-center justify-between px-2 bg-gradient-to-r from-black to-[#003760]">
                <div className="w-full h-full flex items-center justify-start gap-1">
                    <div className="h-9 sm:h-10 aspect-square">
                        <img src="/icon.png" alt="" className="w-full h-full" />
                    </div>
                    <div className={`${rubik_vinyl.className} h-auto flex-1 text-[30px] sm:text-[35px] font-bold text-white`}>
                        DefectLens
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent parent div's onClick from firing
                        openHistryBar();
                    }}
                    className="h-full aspect-square flex justify-start items-center">
                    {sidebarOpenStatas ?
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-2/3 aspect-square">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-3/4 aspect-square">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
                        </svg>
                    }
                </button>
            </div>

            <div className="w-full h-full pt-5 flex flex-col gap-4 px-2 lg:px-10">
                <div className="mb-4">
                    <div className="w-full h-7 sm:h-8 md:h-10 lg:h-12 flex flex-row gap-2 justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="h-3/4 aspect-square">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                        </svg>

                        <p className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#6c62f9]  to-[#90ffeb] text-transparent bg-clip-text">Elevate Your Code Quality</p>
                    </div>
                    <div className={`${lobster.className} w-full flex justify-center items-center text-xs md:text-sm lg:text-base text-[#52caef8f]`}>
                        Code Quality Guardian: Detect Defects, Enhance Maintainability
                    </div>
                </div>

                {/* start:::Prediction Mode */}
                <div className="w-full h-auto px-2 py-3 2md:px-4 lg:py-4 bg-transparent border md:border-2 border-[#374151] rounded-lg 2md:rounded-xl hover:border-[#00ffce] hover:shadow-box-shadow hover:border">
                    <div className={`${acme.className} text-lg md:text-xl xl:text-2xl mb-1.5 underline text-[#91b9fd]`}>Select Prediction Mode</div>
                    <div className="w-full pl-2 flex max-2md:justify-center 2md:align-middle flex-col 2md:flex-row text-sm md:text-base xl:text-lg font-semibold space-y-2 md:space-x-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="predictionType"
                                value={PREDICTION_BY_COURCE_CODE}
                                checked={selectedOption === PREDICTION_BY_COURCE_CODE}
                                onChange={handleOptionChange}
                                className="mr-2 text-blue-500 focus:ring-blue-500 w-3.5 md:w-4 aspect-square"
                            />
                            Predict from source code
                        </label>

                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="predictionType"
                                value={PREDICTION_BY_ATTRIBUTES}
                                checked={selectedOption === PREDICTION_BY_ATTRIBUTES}
                                onChange={handleOptionChange}
                                className="mr-2 text-blue-500 focus:ring-blue-500 w-3.5 md:w-4 aspect-square"
                            />
                            Predict from attributes
                        </label>

                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="predictionType"
                                value={PREDICTION_TO_CHECK_ACCURACY}
                                checked={selectedOption === PREDICTION_TO_CHECK_ACCURACY}
                                onChange={handleOptionChange}
                                className="mr-2 text-blue-500 focus:ring-blue-500 w-3.5 md:w-4 aspect-square"
                            />
                            Check Accuracy
                        </label>
                    </div>
                </div>
                {/* end:::Prediction Mode */}

                {/* start:::Predict From Source Code */}
                {selectedOption === PREDICTION_BY_COURCE_CODE &&
                    <div className="w-full h-auto px-2 py-3 2md:px-4 2md:py-6 bg-transparent border md:border-2 border-[#374151] rounded-lg 2md:rounded-xl hover:border-[#00ffce] hover:shadow-box-shadow hover:border">
                        <div className="h-auto w-full text-xl 2md:text-2xl font-bold mb-4 2md:mb-5">
                            <p className={`${acme.className} text-lg md:text-xl xl:text-2xl underline text-[#91b9fd] w-auto`}>Upload Files</p>
                            <div className="text-xs md:text-sm xl:text-base sm:flex sm:flex-row gap-2">
                                <p>{"[For Labeled(last-col) Source File: .csv/.xls/.xlsx"}</p>
                                <p>{"& For Target File/Code: .zip]"}</p>
                            </div>
                        </div>

                        <div className="w-full h-auto sm:pl-2 flex flex-col max-2md:justify-center text-sm md:text-base xl:text-lg gap-2 mb-5">
                            <div className="flex  flex-row sm:gap-1 w-full h-auto">
                                <label
                                    htmlFor="sourceFileInput"
                                    className="font-semibold min-w-36 2md:min-w-44"
                                >
                                    Select a source file:
                                </label>
                                <input
                                    id="sourceFileInput"
                                    type="file"
                                    className="text-xs md:text-sm xl:text-base w-auto"
                                    placeholder="Choose File"
                                    accept=".csv, .xls, .xlsx"
                                    onChange={handleSourceFileInputChange}
                                />
                            </div>
                            <div className="flex flex-row sm:gap-1 w-full h-auto">
                                <label
                                    htmlFor="targetFileInput"
                                    className="font-semibold min-w-36 2md:min-w-48"
                                >
                                    Select a target file/code:
                                </label>
                                <input
                                    id="targetFileInput"
                                    type="file"
                                    className="text-xs md:text-sm xl:text-base w-auto"
                                    placeholder="Choose File"
                                    accept=".zip"
                                    onChange={handleTargetFileInputChange}
                                />
                            </div>
                        </div>

                        <div className="w-full h-8 2md:h-10 flex gap-5 2md:gap-10 *:flex *:justify-center *:items-center *:rounded-md text-base font-bold text-white">
                            <button onClick={handelCancel} className="w-36 2md:w-40 h-full bg-[#ff2752]">Cancel</button>
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-36 2md:w-40 h-full bg-blue-600">
                                {isLoading ?
                                    <>
                                        <svg aria-hidden="true" className="h-1/2 aspect-square animate-spin text-gray-400 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        <span className="ml-2">Loading....</span>
                                    </>
                                    :
                                    <>Submit</>
                                }
                            </button>
                        </div>
                    </div>
                }
                {/* end:::Predict From Source Code */}

                {/* start:::Predict From Attributes */}
                {/* {selectedOption === PREDICTION_BY_ATTRIBUTES &&
                    <div className="w-full h-auto px-2 py-3 2md:px-4 2md:py-6 bg-white bg-opacity-35 shadow-md rounded-lg 2md:rounded-xl">
                        <div className="h-full w-full text-xl 2md:text-2xl font-bold mb-5 2md:mb-6">
                            <p className='w-auto'>Upload Files</p>
                            <div className="text-base 2md:text-lg 2md:flex 2md:flex-row gap-2">
                                <p>{"[For Labeled(last-col) Source File: .csv/.xls/.xlsx"}</p>
                                <p>{"& For Target File/Code: .csv/.xls/.xlsx]"}</p>
                            </div>
                        </div>

                        <div className="w-full h-auto pl-2 flex flex-col max-2md:justify-center text-lg 2md:text-xl gap-2 mb-7">
                            <div className="flex w-full h-auto">
                                <label
                                    htmlFor="sourceFileInput"
                                    className="text-base font-semibold 2md:text-lg min-w-36 2md:min-w-44"
                                >
                                    Select a source file:
                                </label>
                                <input
                                    id="sourceFileInput"
                                    type="file"
                                    className="text-sm 2md:text-base"
                                    placeholder="Choose File"
                                    accept=".csv, .xls, .xlsx"
                                    onChange={handleSourceFileInputChange}
                                />
                            </div>
                            <div className="flex w-full h-auto">
                                <label
                                    htmlFor="targetFileInput"
                                    className="text-base font-semibold 2md:text-lg min-w-36 2md:min-w-44"
                                >
                                    Select a target file:
                                </label>
                                <input
                                    id="targetFileInput"
                                    type="file"
                                    className="text-sm 2md:text-base"
                                    placeholder="Choose File"
                                    accept=".csv, .xls, .xlsx"
                                    onChange={handleTargetFileInputChange}
                                />
                            </div>
                        </div>

                        <div className="w-full h-8 2md:h-10 flex gap-5 2md:gap-10 *:flex *:justify-center *:items-center *:rounded-md text-base font-bold text-white">
                            <button onClick={handelCancel} className="w-36 2md:w-40 h-full bg-[#ff2752]">Cancel</button>
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-36 2md:w-40 h-full bg-blue-600">
                                {isLoading ?
                                    <>
                                        <svg aria-hidden="true" className="h-1/2 aspect-square animate-spin text-gray-400 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        <span className="ml-2">Loading....</span>
                                    </>
                                    :
                                    <>Submit</>
                                }
                            </button>
                        </div>
                    </div>
                } */}
                {/* end:::Predict From Attributes */}

                {/* start:::Check Accuracy */}
                {/* {selectedOption === PREDICTION_TO_CHECK_ACCURACY &&
                    <div className="w-full h-auto px-2 py-3 2md:px-4 2md:py-6 bg-white bg-opacity-35 shadow-md rounded-lg 2md:rounded-xl">
                        <div className="h-full w-full text-xl 2md:text-2xl font-bold mb-5 2md:mb-6">
                            <p className='w-auto'>Upload Files</p>
                            <p className="text-base 2md:text-lg">
                                {"[For Labeled(last-col) Source File or Target File: .csv/.xls/.xlsx]"}
                            </p>
                        </div>

                        <div className="w-full h-auto pl-2 flex flex-col max-2md:justify-center text-lg 2md:text-xl gap-2 mb-7">
                            <div className="flex w-full h-auto">
                                <label
                                    htmlFor="sourceFileInput"
                                    className="text-base font-semibold 2md:text-lg min-w-36 2md:min-w-44"
                                >
                                    Select a source file:
                                </label>
                                <input
                                    id="sourceFileInput"
                                    type="file"
                                    className="text-sm 2md:text-base"
                                    placeholder="Choose File"
                                    accept=".csv, .xls, .xlsx"
                                    onChange={handleSourceFileInputChange}
                                />
                            </div>
                            <div className="flex w-full h-auto">
                                <label
                                    htmlFor="targetFileInput"
                                    className="text-base font-semibold 2md:text-lg min-w-36 2md:min-w-44"
                                >
                                    Select a target file:
                                </label>
                                <input
                                    id="targetFileInput"
                                    type="file"
                                    className="text-sm 2md:text-base"
                                    placeholder="Choose File"
                                    accept=".csv, .xls, .xlsx"
                                    onChange={handleTargetFileInputChange}
                                />
                            </div>
                        </div>

                        <div className="w-full h-8 2md:h-10 flex gap-5 2md:gap-10 *:flex *:justify-center *:items-center *:rounded-md text-base font-bold text-white">
                            <button onClick={handelCancel} className="w-36 2md:w-40 h-full bg-[#ff2752]">Cancel</button>
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="w-36 2md:w-40 h-full bg-blue-600">
                                {isLoading ?
                                    <>
                                        <svg aria-hidden="true" className="h-1/2 aspect-square animate-spin text-gray-400 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        <span className="ml-2">Loading....</span>
                                    </>
                                    :
                                    <>Submit</>
                                }
                            </button>
                        </div>
                    </div>
                } */}
                {/* end:::Check Accuracy */}


                <div className="flex-1 w-full bg-red-200">
                </div>
            </div>
        </div >
    </>)
}