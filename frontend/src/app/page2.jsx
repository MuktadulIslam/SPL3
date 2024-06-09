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
  const [moduleInputByGithub, setModuleInputByGithub] = useState(true);
  const [resultData, setResultData] = useState(null)
  const folderFiles = useRef(null)
  const singleFile = useRef(null)

  const handleFolderInputChange = (event) => {
    event.preventDefault();
    setResultData(null);
    const selectedFiles = event.target.files;
    folderFiles.current = selectedFiles;
  };
  const handleFileInputChange = (event) => {
    event.preventDefault();
    setResultData(null);
    const selectedFile = event.target.files[0];
    singleFile.current = selectedFile;
    console.log(singleFile.current)
  };
  const handleInputTypeChange = (event) => {
    event.preventDefault();
    setResultData(null);
    if (event.target.value == "github") setModuleInputByGithub(true);
    else setModuleInputByGithub(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    // Create a FormData object
    const formData = new FormData();
    
    // Append each selected file to the FormData object
    if (folderFiles.current) {
      // for (let i = 0; i < folderFiles.current.length; i++) {
      //   formData.append('files', folderFiles.current[i]);
      // }
      formData.append("files", folderFiles.current)
    }
    console.log("Form Data", formData)
    
    // Send the FormData object to the backend
    fetch('http://localhost:5000/', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      // Handle response from the backend
      console.log(response)
    })
    .catch(error => {
      // Handle error
      console.log(error)
    });

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
          <div className="h-auto min-h-12 w-full flex items-center mt-2 pl-2">
            <label
              htmlFor="input-type"
              className="text-lg 2md:text-xl mr-2 font-semibold"
            >
              Software Repository Type:
            </label>
            <select
              id="input-type"
              className="text-lg px-2 rounded-md border border-black"
              onChange={(e) => handleInputTypeChange(e)}
            >
              <option value="github">Github-Link</option>
              <option value="pc">From Your Pc</option>
            </select>
          </div>

          {moduleInputByGithub ? (
            <div className="h-auto min-h-8 w-full mt-4 flex flex-col gap-2 items-center pl-2">
              <div className="flex w-full h-auto">
                <label
                  htmlFor="fileInput"
                  className="text-base 2md:text-lg font-semibold min-w-24 2md:w-28"
                >
                  Github Link:
                </label>
                <input
                  id="fileInput"
                  type="text"
                  className="text-base flex-1 mr-2 sm:mr-5 max-w-[650px] rounded-md px-1 sm:px-2 border border-black"
                  placeholder="github HTTPS"
                  onChange={(e) => handleFileInputChange(e)}
                />
              </div>
            </div>
          ) : (
            <div className="h-auto min-h-12 w-full mt-4 flex flex-col gap-2 items-center pl-2">
              <div className="flex w-full h-auto">
                <label
                  htmlFor="folderInput"
                  className="text-base 2md:text-lg font-semibold min-w-28 2md:min-w-32"
                >
                  Select a folder:
                </label>
                <input
                  id="folderInput"
                  type="file"
                  className="text-sm 2md:text-base"
                  placeholder="Choose Folder"
                  webkitdirectory=""
                  directory=""
                  onChange={(e) => handleFolderInputChange(e)}
                />
              </div>
              <div className="flex w-full h-auto">
                <label
                  htmlFor="fileInput"
                  className="text-base 2md:text-lg font-semibold min-w-28 2md:min-w-32"
                >
                  Select a file:
                </label>
                <input
                  id="fileInput"
                  type="file"
                  className="text-sm 2md:text-base"
                  placeholder="Choose File"
                  onChange={(e) => handleFileInputChange(e)}
                />
              </div>
            </div>
          )}

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
                    <td className="">{index+1}</td>
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
