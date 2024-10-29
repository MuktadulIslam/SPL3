export default function DataTable({ attributesData, attributesDataHeader }) {
    return (
        <div className="container mx-auto mt-8">
          <h1 className="text-2xl font-bold mb-4">File Metrics</h1>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                {attributesDataHeader && attributesDataHeader.map((header) => (
                  <th key={header.variable_name} className="py-2 px-4 border">
                    {header.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attributesData && attributesData.map((data, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  {attributesDataHeader.map((headerData, index2) => (
                    <td key={index2} className="py-2 px-4 border">
                      {data[headerData.variable_name]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  };