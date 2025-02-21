export default function DataTable({ attributesData, attributesDataHeader }) {
    return (
      <>
        <div className="w-full overflow-auto mb-6">
          <table className="relative">
            <thead>
              <tr className="">
                <th className="py-1.5 px-2 bg-blue-200 text-gray-950 min-w-16">S.No.</th>
                {
                  attributesDataHeader && attributesDataHeader.map((header, index) => (
                    <th key={header} className={`py-1.5 px-2 bg-blue-200 text-gray-950 min-w-16 ${index === attributesDataHeader.length - 1 ? 'sticky right-0' : ''}`}>
                      {header}
                    </th>
                  ))
                }
              </tr>
            </thead>
            <tbody>
              {attributesDataHeader && attributesData && attributesData.map((row_data, index) => (
                <tr key={index} className="hover:bg-gray-200 hover:text-gray-950">
                  <td className="py-1 text-center sticky">{index+1}</td>
                  {attributesDataHeader.map((headerData, index2) => {
                    const cellValue = row_data[headerData]; // get the value for the current header
  
                    // Check if the header is "bug" or "bug_prediction"
                    if (headerData === "bug" || headerData === "bug_prediction") {
                      // Determine the display text based on the value
                      return (
                        <td key={index2}
                        className={`lg-py-1 px-2 w-full h-full text-center font-semibold ${index2 === attributesDataHeader.length - 1 ? 'sticky right-0 bg-white' : ''}`}
                          style={{ backgroundColor: cellValue === 1 ? "#fb2984db" : "#00d493", color: cellValue === 1 ? "white" : "black" }}>
                          {cellValue === 1 ? "Defective" : "Good"}
                        </td>
                      );
                    } else {
                      return (
                        <td key={index2} className="lg-py-1 px-2">
                          {cellValue}
                        </td>
                      );
                    }
                  })
                  }
                </tr>
              ))}
            </tbody>
  
          </table>
        </div>
      </>
    );
  };