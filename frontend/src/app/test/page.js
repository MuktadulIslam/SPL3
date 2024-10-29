'use client'
import { useRef, useState } from 'react';
import axios from 'axios';
import DataTable from './DataTable';

export default function Page() {
  const sourceFile = useRef(null);
  const targetFile = useRef(null);
  const [responseData, setResponseData] = useState(null);
  const [responseDataHeader, setResponseDataHeader] = useState(null);

  const handleSourceFileInputChange = (event) => {
    event.preventDefault();
    sourceFile.current = event.target.files[0];
  };

  const handleTargetFileInputChange = (event) => {
    event.preventDefault();
    targetFile.current = event.target.files[0];
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', targetFile.current);

    try {
      const res = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResponseData(res.data.data)
      setResponseDataHeader(res.data.dataHeader)
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handelCancel = () => {
    document.querySelector('#sourceFileInput').value = '';
    document.querySelector('#targetFileInput').value = '';
    
    sourceFile.current  = null;
    targetFile.current  = null;
    setResultData([]);
    setResponseData(null)
    setResponseDataHeader(null)
  }

  return (
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
              accept=".zip"
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

      {/* Output */}
      <div className='w-full overflow-auto'>
        {responseData && (
          <DataTable attributesData={responseData} attributesDataHeader={responseDataHeader} />
        )}
      </div>
    </div>
  );
}
