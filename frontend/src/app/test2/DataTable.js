export default function DataTable({ attributesData, attributesDataHeader }) {
  console.log(attributesData)
  return (
    <>
      <div className="w-full overflow-auto">
        <table className="border-collapse">
          <thead>
            <tr className="">
              {
                attributesDataHeader && attributesDataHeader.map((header) => (
                  <th key={header} className="py-1.5 px-2 bg-blue-200 min-w-16">
                    {header}
                  </th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            {attributesDataHeader && attributesData && attributesData.map((row_data, index) => (
              <tr key={index} className="hover:bg-gray-300">
                {attributesDataHeader.map((headerData, index2) => {
                  const cellValue = row_data[headerData]; // get the value for the current header

                  // Check if the header is "bug" or "bug_prediction"
                  if (headerData === "bug" || headerData === "bug_prediction") {
                    // Determine the display text based on the value
                    return (
                      <td key={index2} className="py-1 px-2 w-full h-full text-center font-semibold"
                        style={{ backgroundColor: cellValue === 1 ? "#ff2752e2" : "#36ff24ba", color: cellValue === 1 ? "white" : "black" }}>
                        {cellValue === 1 ? "Defected" : "Good"}
                      </td>
                    );
                  } else {
                    return (
                      <td key={index2} className="py-1 px-2">
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