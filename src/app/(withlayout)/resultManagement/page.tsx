import Link from "next/link";
import React from "react";

const ResultManagementPage = () => {
  return (
    <div className="flex justify-center">
      <div className="w-full h-[490px] flex justify-center items-center ">
        <div className="grid md:grid-cols-2 gap-20">
          <Link href="/resultManagement/resultUpload">
            <div className="flex justify-center items-center bg-white rounded w-72 h-44 shadow-md hover:shadow-lg ">
              <h3 className="cursor-pointer text-xl leading-8 font-semibold text-center text-indigo-600 dark:text-white">
                Upload <br></br>
                Student Result
              </h3>
            </div>
          </Link>
          <Link href="/resultManagement/studentMarksheet">
            <div className="flex justify-center items-center bg-white rounded w-72 h-44 shadow-md hover:shadow-lg ">
              <h3 className="cursor-pointer text-xl leading-8 font-semibold text-center text-indigo-600 dark:text-white">
                Student <br></br>
                Marksheet
              </h3>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultManagementPage;
