import React from "react";

const NoDataFound = ({ setShowModal }: any) => {
  return (
    <div>
      <div className="w-[620px] h-[300px] shadow-md  text-gray-400  bg-white  shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
        <div className="flex justify-end pt-2">
          <button
            className="text-gray-500 pe-2 background-transparent font-semibold uppercase  text-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="button"
            onClick={() => setShowModal(false)}
          >
            X
          </button>
        </div>
        <div className="flex items-center justify-center mt-16">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-10 h-10 ms-10 mb-1"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
              />
            </svg>
            <h3 className="text-lg font-bold text-gray-400 dark:text-white">
              No Data Found
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoDataFound;
