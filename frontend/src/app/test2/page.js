import React from 'react';

const DataTable = ({ data }) => {
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">File Metrics</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="py-2 px-4 border">File Name</th>
            <th className="py-2 px-4 border">Unique Operators</th>
            <th className="py-2 px-4 border">Unique Operands</th>
            <th className="py-2 px-4 border">Total Operators</th>
            <th className="py-2 px-4 border">Total Operands</th>
            <th className="py-2 px-4 border">Program Volume</th>
            <th className="py-2 px-4 border">Program Length</th>
            <th className="py-2 px-4 border">Program Vocabulary</th>
            <th className="py-2 px-4 border">Program Difficulty</th>
            <th className="py-2 px-4 border">Programming Effort</th>
            <th className="py-2 px-4 border">Number of Lines</th>
            <th className="py-2 px-4 border">LOC Executable</th>
            <th className="py-2 px-4 border">LOC Comments</th>
            <th className="py-2 px-4 border">LOC Blank</th>
          </tr>
        </thead>
        <tbody>
          {data.map((file) => (
            <tr key={file.file_name} className="hover:bg-gray-100">
              <td className="py-2 px-4 border">{file.file_name}</td>
              <td className="py-2 px-4 border">{file.data.unique_operators}</td>
              <td className="py-2 px-4 border">{file.data.unique_operands}</td>
              <td className="py-2 px-4 border">{file.data.total_operators}</td>
              <td className="py-2 px-4 border">{file.data.total_operands}</td>
              <td className="py-2 px-4 border">{file.data.program_volume}</td>
              <td className="py-2 px-4 border">{file.data.program_length}</td>
              <td className="py-2 px-4 border">{file.data.program_vocabulary}</td>
              <td className="py-2 px-4 border">{file.data.program_difficulty}</td>
              <td className="py-2 px-4 border">{file.data.programming_effort}</td>
              <td className="py-2 px-4 border">{file.data.number_of_lines}</td>
              <td className="py-2 px-4 border">{file.data.loc_executable}</td>
              <td className="py-2 px-4 border">{file.data.loc_comments}</td>
              <td className="py-2 px-4 border">{file.data.loc_blank}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Example usage
const App = () => {
  const data = [
    {
      file_name: 'example/CommandLineDemo.java',
      data: {
        unique_operators: 25,
        unique_operands: 59,
        total_operators: 255,
        total_operands: 184,
        program_volume: 737.3585,
        program_length: 84,
        program_vocabulary: 439,
        program_difficulty: 40.8832,
        programming_effort: 30145.575,
        intelligent_content: 18.0653,
        delivered_bug: 0.3229,
        programming_time: 1674.7542,
        number_of_lines: 102,
        loc_executable: 85,
        loc_comments: 0,
        loc_code_with_comments: 0,
        loc_blank: 17,
        loc_total: 85,
      },
    },
    {
      file_name: 'example/Main.java',
      data: {
        unique_operators: 14,
        unique_operands: 14,
        total_operators: 21,
        total_operands: 15,
        program_volume: 144.7579,
        program_length: 28,
        program_vocabulary: 36,
        program_difficulty: 9.8,
        programming_effort: 1418.6274,
        intelligent_content: 14.7653,
        delivered_bug: 0.0421,
        programming_time: 78.8126,
        number_of_lines: 18,
        loc_executable: 6,
        loc_comments: 4,
        loc_code_with_comments: 2,
        loc_blank: 4,
        loc_total: 8,
      },
    },
  ];

  return <DataTable data={data} />;
};

export default App;
