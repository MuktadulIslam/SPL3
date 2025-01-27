"use client"
import { Acme } from "next/font/google";
import { useRef, useState } from "react";
import axios from 'axios';
import { useMutation } from 'react-query';
import * as XLSX from 'xlsx';
import DataTable from "@/components/DataTable";

const acme = Acme({
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


export default function Background() {

  const PREDICTION_BY_COURCE_CODE = "predictionBySourceCode";
  const PREDICTION_BY_COURCE_CODE_WITH_TRAINING_FILE = "predictionBySourceCodeWithTrainingFile";
  const PREDICTION_BY_ATTRIBUTES = "predictionByattributes";
  const PREDICTION_BY_ATTRIBUTES_WITH_TRAINING_FILE = "predictionByattributesWithTrainingFile";
  const PREDICTION_TO_CHECK_ACCURACY = "predictionToCheckAccuracy";
  const [selectedOption, setSelectedOption] = useState(PREDICTION_BY_COURCE_CODE);

  const sourceFile = useRef(null);
  const targetFile = useRef(null);
  const sourceFileInputRef = useRef(null);
  const targetFileInputRef = useRef(null);
  const [responseData, setResponseData] = useState(null);
  const [responseDataHeader, setResponseDataHeader] = useState(null);
  const [methodName, setMethodName] = useState(null);
  const [methodAccuracy, setMethodAccuracy] = useState(null);
  const [cancelToken, setCancelToken] = useState(null); // Store cancel token

  const resetInputData = () => {
    if (sourceFileInputRef.current) sourceFileInputRef.current.value = '';
    if (targetFileInputRef.current) targetFileInputRef.current.value = '';
    sourceFile.current = null;
    targetFile.current = null;
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
  };

  const handleTargetFileInputChange = (event) => {
    event.preventDefault();
    targetFile.current = event.target.files[0];
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
    resetInputData(); // Reset all form fields and state
  }

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    resetInputData()
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

  return (
    <>
      {/* start:::Prediction Mode */}
      <div className="w-full h-auto px-2 py-3 2md:px-4 lg:py-4 bg-transparent border md:border-2 border-[#374151] rounded-lg 2md:rounded-xl hover:border-[#00ffce] hover:shadow-box-shadow">
        <div className={`${acme.className} text-lg md:text-xl xl:text-2xl mb-1.5 text-[#91b9fd]`}>Select Prediction Mode</div>
        <div className="w-full pl-2 2md:grid 2md:grid-cols-3 2md:gap-x-8 max-2md:flex-row max-2md:justify-center max-2md:align-middle text-sm md:text-base xl:text-lg font-semibold space-y-2">
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
              value={PREDICTION_BY_COURCE_CODE_WITH_TRAINING_FILE}
              checked={selectedOption === PREDICTION_BY_COURCE_CODE_WITH_TRAINING_FILE}
              onChange={handleOptionChange}
              className="mr-2 text-blue-500 focus:ring-blue-500 w-3.5 md:w-4 aspect-square"
            />
            Predict from source code with Training File
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
              value={PREDICTION_BY_ATTRIBUTES_WITH_TRAINING_FILE}
              checked={selectedOption === PREDICTION_BY_ATTRIBUTES_WITH_TRAINING_FILE}
              onChange={handleOptionChange}
              className="mr-2 text-blue-500 focus:ring-blue-500 w-3.5 md:w-4 aspect-square"
            />
            Predict from attributes with Training File
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
        <div className="w-full h-auto px-2 py-3 2md:px-4 2md:py-6 bg-transparent border md:border-2 border-[#374151] rounded-lg 2md:rounded-xl hover:border-[#00ffce] hover:shadow-box-shadow">
          <div className="h-auto w-full text-xl 2md:text-2xl font-bold mb-4 2md:mb-5">
            <p className={`${acme.className} text-lg md:text-xl xl:text-2xl text-[#91b9fd] w-auto`}>Upload Files</p>
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
                ref={sourceFileInputRef}
                onChange={handleSourceFileInputChange}
              />
            </div>
          </div>

          <div className="w-full h-8 2md:h-10 flex gap-5 2md:gap-10 *:flex *:justify-center *:items-center *:rounded-md text-base lg:text-lg font-bold text-white">
            <button onClick={handelCancel} className="w-36 2md:w-40 h-full bg-gradient-to-r from-[#fb75df] to-[#ec4975]">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-36 2md:w-40 h-full bg-gradient-to-r from-[#8b75fb] to-[#43f4df]">
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

      {/* start:::Predict From Source Code With Training File */}
      {selectedOption === PREDICTION_BY_COURCE_CODE_WITH_TRAINING_FILE &&
        <div className="w-full h-auto px-2 py-3 2md:px-4 2md:py-6 bg-transparent border md:border-2 border-[#374151] rounded-lg 2md:rounded-xl hover:border-[#00ffce] hover:shadow-box-shadow">
          <div className="h-auto w-full text-xl 2md:text-2xl font-bold mb-4 2md:mb-5">
            <p className={`${acme.className} text-lg md:text-xl xl:text-2xl text-[#91b9fd] w-auto`}>Upload Files</p>
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
                ref={sourceFileInputRef}
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
                ref={targetFileInputRef}
                onChange={handleTargetFileInputChange}
              />
            </div>
          </div>

          <div className="w-full h-8 2md:h-10 flex gap-5 2md:gap-10 *:flex *:justify-center *:items-center *:rounded-md text-base lg:text-lg font-bold text-white">
            <button onClick={handelCancel} className="w-36 2md:w-40 h-full bg-gradient-to-r from-[#fb75df] to-[#ec4975]">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-36 2md:w-40 h-full bg-gradient-to-r from-[#8b75fb] to-[#43f4df]">
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
      {/* end:::Predict From Source Code With Training File*/}

      {/* start:::Predict From Attributes */}
      {selectedOption === PREDICTION_BY_ATTRIBUTES &&
        <div className="w-full h-auto px-2 py-3 2md:px-4 2md:py-6 bg-transparent border md:border-2 border-[#374151] rounded-lg 2md:rounded-xl hover:border-[#00ffce] hover:shadow-box-shadow">
          <div className="h-auto w-full text-xl 2md:text-2xl font-bold mb-4 2md:mb-5">
            <p className={`${acme.className} text-lg md:text-xl xl:text-2xl text-[#91b9fd] w-auto`}>Upload Files</p>
            <div className="text-xs md:text-sm xl:text-base sm:flex sm:flex-row gap-2">
              <p>{"[For Labeled(last-col) Source File: .csv/.xls/.xlsx"}</p>
              <p>{"& For Target File/Code: .csv/.xls/.xlsx]"}</p>
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
                ref={sourceFileInputRef}
                onChange={handleSourceFileInputChange}
              />
            </div>
          </div>

          <div className="w-full h-8 2md:h-10 flex gap-5 2md:gap-10 *:flex *:justify-center *:items-center *:rounded-md text-base lg:text-lg font-bold text-white">
            <button onClick={handelCancel} className="w-36 2md:w-40 h-full bg-gradient-to-r from-[#fb75df] to-[#ec4975]">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-36 2md:w-40 h-full bg-gradient-to-r from-[#8b75fb] to-[#43f4df]">
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

      {/* start:::Predict From Attributes With Training File*/}
      {selectedOption === PREDICTION_BY_ATTRIBUTES_WITH_TRAINING_FILE &&
        <div className="w-full h-auto px-2 py-3 2md:px-4 2md:py-6 bg-transparent border md:border-2 border-[#374151] rounded-lg 2md:rounded-xl hover:border-[#00ffce] hover:shadow-box-shadow">
          <div className="h-auto w-full text-xl 2md:text-2xl font-bold mb-4 2md:mb-5">
            <p className={`${acme.className} text-lg md:text-xl xl:text-2xl text-[#91b9fd] w-auto`}>Upload Files</p>
            <div className="text-xs md:text-sm xl:text-base sm:flex sm:flex-row gap-2">
              <p>{"[For Labeled(last-col) Source File: .csv/.xls/.xlsx"}</p>
              <p>{"& For Target File/Code: .csv/.xls/.xlsx]"}</p>
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
                ref={sourceFileInputRef}
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
                accept=".csv, .xls, .xlsx"
                ref={targetFileInputRef}
                onChange={handleTargetFileInputChange}
              />
            </div>
          </div>

          <div className="w-full h-8 2md:h-10 flex gap-5 2md:gap-10 *:flex *:justify-center *:items-center *:rounded-md text-base lg:text-lg font-bold text-white">
            <button onClick={handelCancel} className="w-36 2md:w-40 h-full bg-gradient-to-r from-[#fb75df] to-[#ec4975]">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-36 2md:w-40 h-full bg-gradient-to-r from-[#8b75fb] to-[#43f4df]">
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
      {/* end:::Predict From Attributes With Training File*/}

      {/* start:::Check Accuracy */}
      {selectedOption === PREDICTION_TO_CHECK_ACCURACY &&
        <div className="w-full h-auto px-2 py-3 2md:px-4 2md:py-6 bg-transparent border md:border-2 border-[#374151] rounded-lg 2md:rounded-xl hover:border-[#00ffce] hover:shadow-box-shadow">
          <div className="h-auto w-full text-xl 2md:text-2xl font-bold mb-4 2md:mb-5">
            <p className={`${acme.className} text-lg md:text-xl xl:text-2xl text-[#91b9fd] w-auto`}>Upload Files</p>
            <div className="text-xs md:text-sm xl:text-base sm:flex sm:flex-row gap-2">
              <p>{"[For Labeled(last-col) Source File or Target File: .csv/.xls/.xlsx]"}</p>
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
                ref={sourceFileInputRef}
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
                accept=".csv, .xls, .xlsx"
                ref={targetFileInputRef}
                onChange={handleTargetFileInputChange}
              />
            </div>
          </div>

          <div className="w-full h-8 2md:h-10 flex gap-5 2md:gap-10 *:flex *:justify-center *:items-center *:rounded-md text-base lg:text-lg font-bold text-white">
            <button onClick={handelCancel} className="w-36 2md:w-40 h-full bg-gradient-to-r from-[#fb75df] to-[#ec4975]">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-36 2md:w-40 h-full bg-gradient-to-r from-[#8b75fb] to-[#43f4df]">
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
      {/* end:::Check Accuracy */}


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
    </ >
  )
}