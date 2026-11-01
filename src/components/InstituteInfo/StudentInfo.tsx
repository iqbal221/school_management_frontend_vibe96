import React from "react";

const StudentInfo = ({ classs, Male, Female, Total }: any) => {
  return (
    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
      <tr>
        <td className="w-40 px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
          {classs}
        </td>
        <td className="w-40 px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          {Male}
        </td>
        <td className="w-40 px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
          {Female}
        </td>
        <td className="w-40 px-9 py-4 whitespace-nowrap font-bold text-sm text-gray-800 dark:text-neutral-200">
          {Total}
        </td>
      </tr>
    </tbody>
  );
};

export default StudentInfo;
