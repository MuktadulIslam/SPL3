"use client";

import { useRef, useState } from "react";

const results = [
  {
    fileName: "Indianapolis",
    filePath:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur, saepe.",
    status: true,
  },
  {
    fileName: "Indianapolis",
    filePath:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur, saepe.",
    status: true,
  },
  {
    fileName: "Indianapolis",
    filePath:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur, saepe.",
    status: false,
  },
  {
    fileName: "Indianapolis",
    filePath:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur, saepe.",
    status: false,
  },
  {
    fileName: "Indianapolis",
    filePath:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur, saepe.",
    status: false,
  },
  {
    fileName: "Indianapolis",
    filePath:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur, saepe.",
    status: true,
  },
  {
    fileName: "Indianapolis",
    filePath:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur, saepe.",
    status: false,
  },
  {
    fileName: "Indianapolis",
    filePath:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur, saepe.",
    status: true,
  },
  {
    fileName: "Indianapolis",
    filePath:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur, saepe.",
    status: true,
  },
  {
    fileName: "Indianapolis",
    filePath:
      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur, saepe.",
    status: true,
  },
];

export default function Home() {
  const [resultData, setResultData] = useState(null)

  const sourceFile = useRef(null)
  const targetFile = useRef(null)

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
 

  const handleSubmit = (event) => {
    event.preventDefault();

    setResultData(results)
  };


  return (
    <>
      <div className="w-full min-h-dvh overflow-x-hidden">
        <div className="w-full h-20 xl:h-28 flex justify-center items-center  shadow-lg">
          <h1 className="text-3xl 2md:text-4xl xl:text-5xl font-semibold text-center">
            Software Module Defect Identifier
          </h1>
        </div>
        <div className="w-full h-auto md:ml-6">

          <div className="h-auto min-h-12 w-full mt-4 flex flex-col gap-2 items-center pl-2">
            <div className="flex w-full h-auto">
              <label
                htmlFor="fileInput"
                className="text-base 2md:text-lg font-semibold min-w-36 2md:min-w-44"
              >
                Select a source file:
              </label>
              <input
                id="fileInput"
                type="file"
                className="text-sm 2md:text-base"
                placeholder="Choose File"
                accept=".csv"
                onChange={(e) => handleSourceFileInputChange(e)}
              />
            </div>
            
            <div className="flex w-full h-auto">
              <label
                htmlFor="fileInput"
                className="text-base 2md:text-lg font-semibold min-w-36 2md:min-w-44"
              >
                Select a target file:
              </label>
              <input
                id="fileInput"
                type="file"
                className="text-sm 2md:text-base"
                placeholder="Choose File"
                accept=".csv"
                onChange={(e) => handleTargetFileInputChange(e)}
              />
            </div>
          </div>

          <button onClick={handleSubmit} className="bg-blue-400 text-base md:text-lg font-semibold mt-4 ml-2 py-0.5 px-2 sm:px-4 rounded-md">
            Submit
          </button>
        </div>

        <div className="w-full  h-auto mt-8 sm:mt-10 overflow-hidden">
          <div className="w-full h-auto px-2 overflow-x-auto">
            <table className="border border-slate-500 m-auto">
              <caption className="caption-top font-semibold text-xl 2md:text-2xl pb-2">
                Software Files Status
              </caption>
              <thead className="text-base sm:text-lg">
                <tr className="*:whitespace-nowrap *:border *:border-slate-700 *:py-0.5 *:px-1">
                  <th className="border border-slate-600 min-w-12">SI No</th>
                  <th className="border border-slate-600 min-w-36">File Name</th>
                  <th className="border border-slate-600 min-w-60">File Path</th>
                  <th className="border border-slate-600 min-w-20 max-w-32">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="*:*:text-center *:*:whitespace-nowrap *:*:border *:*:border-slate-700 *:*:py-0.5 *:*:px-1 text-sm sm:text-base">
                {resultData ? resultData.map((result, index) => (
                  <tr key={index} className="odd:bg-gray-300">
                    <td className="">{index + 1}</td>
                    <td className="">{result.fileName}</td>
                    <td className="">{result.filePath}</td>
                    <td className={`text-white ${result.status ? 'bg-red-400' : 'bg-green-400'}`}>
                      {result.status ? (<span>Defected</span>) :
                        (<span>Good</span>)}
                    </td>
                  </tr>
                )) : <></>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
