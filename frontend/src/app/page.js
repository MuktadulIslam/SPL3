"use client";

import { useEffect, useRef, useState } from "react";
import axios from 'axios';

export default function Home() {
  const [resultData, setResultData] = useState(null);
  const sourceFile = useRef(null);
  const targetFile = useRef(null);

  const handleSourceFileInputChange = (event) => {
    event.preventDefault();
    setResultData(null);
    sourceFile.current = event.target.files[0];
  };

  const handleTargetFileInputChange = (event) => {
    event.preventDefault();
    setResultData(null);
    targetFile.current = event.target.files[0];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("source_file", sourceFile.current);
    formData.append("target_file", targetFile.current);

    try {
      axios.post("http://127.0.0.1:8000/predict/", formData).then(function (response) {
        setResultData(response.data)
      })
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  const handelCancel = () => {
    document.querySelector('#sourceFileInput').value = '';
    document.querySelector('#targetFileInput').value = '';
    
    sourceFile.current  = null;
    targetFile.current  = null;
    setResultData([]);
  }

  useEffect(() => {
    axios.get("http://localhost:8000/").then(function (response) {
      console.log(response.data);
    }).catch(function (error) {
      console.error(error);
    });
  }, []);

  return (
    <>
      <div className="w-full overflow-x-hidden min-h-dvh pb-10">
        <div className="flex items-center justify-center w-full h-20 shadow-lg xl:h-28">
          <h1 className="text-3xl font-semibold text-center 2md:text-4xl xl:text-5xl">
            Software Module Defect Identifier
          </h1>
        </div>
        <div className="w-full h-auto md:ml-6">
          <div className="flex flex-col items-center w-full h-auto gap-2 pl-2 mt-4 min-h-12">
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
                accept=".csv"
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
                accept=".csv"
                onChange={handleTargetFileInputChange}
              />
            </div>
          </div>
          <button onClick={handleSubmit} className="bg-blue-400 text-base md:text-lg font-semibold mt-6 ml-2 py-0.5 px-2 sm:px-4 rounded-md">
            Submit
          </button>
          <button onClick={handelCancel} className="bg-red-500 text-white text-base md:text-lg font-semibold mt-6 ml-10 py-0.5 px-2 sm:px-4 rounded-md">
            Cancel
          </button>
        </div>

        {/* start:::output table*/}
        <div className="w-full h-auto mt-8 overflow-hidden sm:mt-10">
          <div className="w-full h-auto px-2 overflow-x-auto">
            <table className="m-auto border border-slate-500">
              <caption className="pb-2 text-xl font-semibold caption-top 2md:text-2xl">
                Software Files Status
              </caption>
              <thead className="text-base sm:text-lg">
                <tr className="*:whitespace-nowrap *:border *:border-slate-700 *:py-0.5 *:px-1">
                  <th className="border border-slate-600 min-w-12">SI No</th>
                  <th className="border border-slate-600 min-w-36">File Name</th>
                  <th className="border border-slate-600 min-w-60">Bug Prediction</th>
                </tr>
              </thead>
              <tbody className="*:*:text-center *:*:whitespace-nowrap *:*:border *:*:border-slate-700 *:*:py-0.5 *:*:px-1 text-sm sm:text-base">
                {resultData ? (
                  resultData.map((result, index) => (
                    <tr key={index} className="odd:bg-gray-300">
                      <td className="">{index + 1}</td>
                      <td className="">{result.name}</td>
                      <td className={`text-white ${result.bug ? 'bg-red-400' : 'bg-green-400'}`}>
                        {result.bug ? 'Defected' : 'Good'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <></>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* end:::output table*/}
      </div>
    </>
  );
}
