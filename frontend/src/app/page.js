"use client"
import { Acme } from "next/font/google";
import { useRef, useState, useContext} from "react";
import axios from 'axios';
import { useMutation } from 'react-query';
import * as XLSX from 'xlsx';
import DataTable from "@/components/DataTable";
import MappingInterface from "@/components/AttributeHeaderSelection"
import Papa from 'papaparse';
import crypto from "crypto";
import { UserContext } from "./AppBackground";

const acme = Acme({
	weight: ['400'],
	style: ["normal"],
	subsets: ["latin"]
})

const getCurrentFormatDate = () => {
	const date = new Date();
	const options = { hour: '2-digit', minute: '2-digit' };
	const time = new Intl.DateTimeFormat('en-GB', options).format(date);

	const day = date.getDate().toString().padStart(2, '0');
	const month = date.toLocaleString('en-US', { month: 'short' });
	const year = date.getFullYear();

	return `${time}, ${day}-${month}-${year}`;
};

const fileToString = (file) => {
	if (file == null) return "";

	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = () => reject(reader.error);
		reader.readAsText(file);
	});
};

const calculateHash = async (file1, file2) => {
	try {
		const file1Text = await fileToString(file1);
		const file2Text = await fileToString(file2);

		const combinedContent = file1Text + file2Text;
		const hash = crypto.createHash("sha512").update(combinedContent).digest("hex");

		return hash;
	} catch (error) {
		console.error("Error calculating hash:", error);
		return "";
	}
};

const getIdNameMapping = (headerMapping) => {
	const mapping = {};

	Object.values(headerMapping).forEach(value => {
		value.short_names.forEach(shortName => {
			mapping[shortName] = value.id_name;
		});
	});

	return mapping;
};


// Mutation function with cancellation token
const fetchPredictionData = async ({ formData, endPoint, cancelToken }) => {
	const response = await axios.post(`http://127.0.0.1:8000/${endPoint}`, formData, {
		cancelToken: cancelToken.token
	});
	return response.data;
};


const keepOnlySpecifiedColumns = (data, mappedSourceFileHeaders) => {
	return data.map(row => {
		const newRow = {};
		Object.entries(mappedSourceFileHeaders).forEach(([oldKey, newKey]) => {
			if (row.hasOwnProperty(oldKey)) {
				newRow[newKey.id_name] = row[oldKey];
			}
		});
		return newRow;
	});
};

const processSourceFile = async (fileRef, mappedSourceFileHeaders) => {
	const fileExtension = fileRef.current.name.split('.').pop().toLowerCase();

	if (fileExtension === 'csv') {
		const originalFile = fileRef.current;

		const processedData = await new Promise((resolve, reject) => {
			Papa.parse(fileRef.current, {
				complete: (results) => {
					if (results.data.length > 0) {
						const processedRows = keepOnlySpecifiedColumns(results.data, mappedSourceFileHeaders);
						const csv = Papa.unparse(processedRows);
						const processedFile = new File(
							[csv],
							originalFile.name,
							{ type: 'text/csv' }
						);
						resolve(processedFile);
					} else {
						reject(new Error('No data found'));
					}
				},
				header: true,
				skipEmptyLines: true,
				error: (error) => reject(error)
			});
		});

		fileRef.current = processedData;

	} else if (['xlsx', 'xls'].includes(fileExtension)) {
		const data = await fileRef.current.arrayBuffer();
		const workbook = XLSX.read(data, { type: 'array' });
		const firstSheetName = workbook.SheetNames[0];
		const worksheet = workbook.Sheets[firstSheetName];

		// Convert to JSON to use the same processing logic as CSV
		let jsonData = XLSX.utils.sheet_to_json(worksheet);

		// Process the data using the same function as CSV
		const processedRows = keepOnlySpecifiedColumns(jsonData);

		// Create new workbook with processed data
		const newWorkbook = XLSX.utils.book_new();
		const newWorksheet = XLSX.utils.json_to_sheet(processedRows);
		XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, firstSheetName);

		// Convert back to file
		const processedBuffer = XLSX.write(newWorkbook, { type: 'array' });
		const processedFile = new File(
			[processedBuffer],
			fileRef.current.name,
			{ type: fileRef.current.type }
		);

		fileRef.current = processedFile;
	}
};


export default function Background() {
	const { user, reloadSideBarFunction } = useContext(UserContext);

	const PREDICTION_BY_COURCE_CODE = "predictionBySourceCode";
	const PREDICTION_BY_SOURCE_CODE_WITH_TRAINING_FILE = "predictionBySourceCodeWithTrainingFile";
	const PREDICTION_BY_ATTRIBUTES = "predictionByattributes";
	const PREDICTION_BY_ATTRIBUTES_WITH_TRAINING_FILE = "predictionByattributesWithTrainingFile";
	const PREDICTION_TO_CHECK_ACCURACY = "predictionToCheckAccuracy";
	const [selectedOption, setSelectedOption] = useState(PREDICTION_BY_COURCE_CODE);

	const sourceFile = useRef(null);
	const targetFile = useRef(null);
	const sourceFileInputRef = useRef(null);
	const targetFileInputRef = useRef(null);
	const [sourceFileHeaders, setSourceFileHeaders] = useState(null)
	const [mappedSourceFileHeaders, setMappedSourceFileHeaders] = useState({})

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
		setSourceFileHeaders(null)
		setMappedSourceFileHeaders({})
	}

	const resetResponseData = () => {
		setResponseData(null)
		setResponseDataHeader(null)
		setMethodName(null)
		setMethodAccuracy(null)
	}

	const setMappingData = async(file) => {
		try {
			const fileExtension = file.name.split('.').pop().toLowerCase();

			if (fileExtension === 'csv') {
				// Handle CSV file
				const text = await file.text();
				Papa.parse(text, {
					header: true,
					complete: (results) => {
						setSourceFileHeaders(results.meta.fields)
					},
					error: (error) => {
						console.error('Error parsing CSV:', error);
					}
				});
			} else if (['xlsx', 'xls'].includes(fileExtension)) {
				// Handle Excel file
				const arrayBuffer = await file.arrayBuffer();
				const workbook = XLSX.read(arrayBuffer, {
					type: 'array',
					cellDates: true,
					cellNF: true,
					cellStyles: true
				});

				const firstSheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[firstSheetName];
				const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
				setSourceFileHeaders(headers)
			}
		} catch (error) {
			console.error('Error reading file:', error);
		}
	}

	const handleTargetFileInputChange = async (event) => {
		event.preventDefault();
		const file = event.target.files[0];
		if (!file) return;
		targetFile.current = event.target.files[0];
		if(selectedOption == PREDICTION_BY_ATTRIBUTES) await setMappingData(file)
	};

	const handleSourceFileInputChange = async (event) => {
		event.preventDefault();
		const file = event.target.files[0];
		if (!file) return;
		sourceFile.current = event.target.files[0];
		if(selectedOption == PREDICTION_BY_SOURCE_CODE_WITH_TRAINING_FILE) await setMappingData(file)
	};

	const { mutate, isLoading, isError, data, error } = useMutation(fetchPredictionData, {
		onSuccess: (data) => {
			setResponseData(data.data);
			setResponseDataHeader(data.data_header);
			setMethodName(data.method_name);
			setMethodAccuracy(data.accuracy);
			resetInputData();
			reloadSideBarFunction((val)=>val+1)
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



	const handleSubmit = async (event) => {
		event.preventDefault();
		resetResponseData();
		const formData = new FormData();
		if (targetFile.current == null) {
			alert("First Upload the targeted(source code/data) dataset");
			return;
		}
		else {
			if (selectedOption === PREDICTION_BY_ATTRIBUTES) await processSourceFile(targetFile, mappedSourceFileHeaders);
			formData.append("target_file", targetFile.current);
		}
		if (selectedOption === PREDICTION_BY_ATTRIBUTES_WITH_TRAINING_FILE ||
			selectedOption === PREDICTION_BY_SOURCE_CODE_WITH_TRAINING_FILE ||
			selectedOption === PREDICTION_TO_CHECK_ACCURACY) {
			if (sourceFile.current == null) {
				alert("First Upload the training(source) dataset");
				return;
			}
			else {
				if (selectedOption === PREDICTION_BY_SOURCE_CODE_WITH_TRAINING_FILE) await processSourceFile(sourceFile, mappedSourceFileHeaders);
				formData.append("source_file", sourceFile.current);
				setSourceFileHeaders(null)
			}
		}

		// Adding More Information
		formData.append("user_id", user.email);
		formData.append("submitted_at", getCurrentFormatDate());
		formData.append("project_name", targetFile.current.name.split(".")[0]);
		formData.append("project_type", selectedOption);
		formData.append("project_hash", await calculateHash(targetFile.current, sourceFile.current));

		let endPoint = null;
		if (selectedOption === PREDICTION_BY_COURCE_CODE) endPoint = "api/predict/from-source-code";
		else if (selectedOption === PREDICTION_BY_SOURCE_CODE_WITH_TRAINING_FILE) endPoint = "api/predict/from-source-code-with-training-data";
		else if (selectedOption === PREDICTION_BY_ATTRIBUTES) endPoint = "api/predict/from-attributes";
		else if (selectedOption === PREDICTION_BY_ATTRIBUTES_WITH_TRAINING_FILE) endPoint = "api/predict/from-attributes-with-training-data";
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
		resetResponseData()
		setMappedSourceFileHeaders({});
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
							value={PREDICTION_BY_SOURCE_CODE_WITH_TRAINING_FILE}
							checked={selectedOption === PREDICTION_BY_SOURCE_CODE_WITH_TRAINING_FILE}
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
							<p>{"[For Source File/Code: .zip]"}</p>
						</div>
					</div>

					<div className="w-full h-auto sm:pl-2 flex flex-col max-2md:justify-center text-sm md:text-base xl:text-lg gap-2 mb-5">
						<div className="flex flex-row sm:gap-1 w-full h-auto">
							<label
								htmlFor="targetFileInput"
								className="font-semibold min-w-36 2md:min-w-48"
							>
								Select a source file/code:
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
			{/* end:::Predict From Source Code */}

			{/* start:::Predict From Source Code With Training File */}
			{selectedOption === PREDICTION_BY_SOURCE_CODE_WITH_TRAINING_FILE &&
				<div className="w-full h-auto px-2 py-3 2md:px-4 2md:py-6 bg-transparent border md:border-2 border-[#374151] rounded-lg 2md:rounded-xl hover:border-[#00ffce] hover:shadow-box-shadow">
					<div className="h-auto w-full text-xl 2md:text-2xl font-bold mb-4 2md:mb-5">
						<p className={`${acme.className} text-lg md:text-xl xl:text-2xl text-[#91b9fd] w-auto`}>Upload Files</p>
						<div className="text-xs md:text-sm xl:text-base">
							{"[Source File should be Labeled with `bug` attribute with {0,1}]"}
						</div>
						<div className="text-xs md:text-sm xl:text-base sm:flex sm:flex-row gap-2">
							<p>{"[For Source File: .csv/.xls/.xlsx"}</p>
							<p>{"& Target File/Code: .zip]"}</p>
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
							<p>{"[Source Attribut File: .csv/.xls/.xlsx"}</p>
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

			{/* start:::Predict From Attributes With Training File*/}
			{selectedOption === PREDICTION_BY_ATTRIBUTES_WITH_TRAINING_FILE &&
				<div className="w-full h-auto px-2 py-3 2md:px-4 2md:py-6 bg-transparent border md:border-2 border-[#374151] rounded-lg 2md:rounded-xl hover:border-[#00ffce] hover:shadow-box-shadow">
					<div className="h-auto w-full text-xl 2md:text-2xl font-bold mb-4 2md:mb-5">
						<p className={`${acme.className} text-lg md:text-xl xl:text-2xl text-[#91b9fd] w-auto`}>Upload Files</p>
						<div className="text-xs md:text-sm xl:text-base">
							{"[Source File should be Labeled with `bug` attribute with {0,1}]"}
						</div>
						<div className="text-xs md:text-sm xl:text-base sm:flex sm:flex-row gap-2">
							<p>{"[For Source & Target File: .csv/.xls/.xlsx"}</p>
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
						<div className="text-xs md:text-sm xl:text-base">
							{"[Both File should be Labeled with `bug` attribute with {0,1}]"}
						</div>
						<div className="text-xs md:text-sm xl:text-base sm:flex sm:flex-row gap-2">
							<p>{"[For Source & Target File: .csv/.xls/.xlsx"}</p>
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

			{/* start:::Attribute Selection */}
			{sourceFileHeaders &&
				<div className="w-full h-auto px-2 py-3 2md:px-4 lg:py-4 bg-transparent border md:border-2 border-[#374151] rounded-lg 2md:rounded-xl">
					<MappingInterface headers={sourceFileHeaders} setMappedSourceFileHeaders={setMappedSourceFileHeaders} mappedSourceFileHeaders={mappedSourceFileHeaders} />
				</div>
			}
			{/* end:::Attribute Selection */}


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