"use client";

import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import Papa from 'papaparse'; // For parsing CSV files

export default function Home() {
  const [resultData, setResultData] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]); // Changed to an array
  const [fullForms] = useState({ // Define a mapping of attributes to their full forms
    attribute1: "Full Form 1",
    attribute2: "Full Form 2",
    attribute3: "Full Form 3",
    // Add other attributes and their full forms here
  });
  const [selectedFullForms, setSelectedFullForms] = useState({}); // Store selected full forms for each attribute
  const sourceFile = useRef(null);
  const targetFile = useRef(null);

  const handleSourceFileInputChange = (event) => {
    event.preventDefault();
    setResultData(null);
    sourceFile.current = event.target.files[0];

    // Read the CSV file to extract attributes
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const headers = results.meta.fields; // Get headers (attributes)
          setAttributes(headers);
        },
      });
    }
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
    formData.append("selected_attributes", JSON.stringify(selectedAttributes)); // Add selected attributes
    formData.append("selected_full_forms", JSON.stringify(selectedFullForms)); // Add selected full forms

    try {
      const response = await axios.post("http://127.0.0.1:8000/predict/", formData);
      setResultData(response.data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handelCancel = () => {
    document.querySelector('#sourceFileInput').value = '';
    document.querySelector('#targetFileInput').value = '';
    
    sourceFile.current = null;
    targetFile.current = null;
    setResultData([]);
    setAttributes([]); // Clear attributes
    setSelectedAttributes([]); // Reset selected attributes
    setSelectedFullForms({}); // Reset selected full forms
  };

  const handleAttributeChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      // Add the selected attribute to the array
      setSelectedAttributes((prev) => [...prev, value]);
      setSelectedFullForms((prev) => ({
        ...prev,
        [value]: "", // Initialize full form selection
      }));
    } else {
      // Remove the deselected attribute from the array
      setSelectedAttributes((prev) => prev.filter((attr) => attr !== value));
      setSelectedFullForms((prev) => {
        const { [value]: _, ...rest } = prev; // Remove the full form for this attribute
        return rest;
      });
    }
  };

  const handleFullFormChange = (event, attribute) => {
    const { value } = event.target;
    setSelectedFullForms((prev) => ({
      ...prev,
      [attribute]: value,
    }));
  };

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

        {/* start:::file selection */}
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
        {/* end:::file selection */}

        {/* start:::attribute selection */}
        {attributes.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Select Attributes:</h2>
            {attributes.map((attribute, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={attribute}
                  name="attributes"
                  value={attribute}
                  onChange={handleAttributeChange}
                />
                <label htmlFor={attribute} className="ml-2 text-base">{attribute}</label>
                {/* Render dropdown for selected attributes */}
                {selectedAttributes.includes(attribute) && (
                  <select
                    value={selectedFullForms[attribute] || ""}
                    onChange={(event) => handleFullFormChange(event, attribute)}
                    className="ml-2 border rounded-md"
                  >
                    <option value="" disabled>Select full form</option>
                    {fullForms[attribute] && (
                      <option value={fullForms[attribute]}>{fullForms[attribute]}</option>
                    )}
                  </select>
                )}
              </div>
            ))}
          </div>
        )}
        {/* end:::attribute selection */}
      </div>
    </>
  );
}
