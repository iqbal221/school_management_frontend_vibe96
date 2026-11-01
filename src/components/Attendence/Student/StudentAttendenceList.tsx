"use client";
import {
  useAddStudentAttendanceWithFormDataMutation,
  useStudentsAttendanceQuery,
} from "@/redux/api/attendenceApi";
import { useStudentsQuery } from "@/redux/api/studentApi";
import { IAttendance } from "@/types/common";
import { useState } from "react";
import { toast } from "react-toastify";

const StudentAttendenceList = ({ componentRef, studentClassTitle }: any) => {
  const query: Record<string, any> = {};

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");

  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;

  const [formSelectData, setFormSelectData] = useState({
    attendanceDate: "",
    attendance: {},
  });

  const handleChangeDate = (e: any) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormSelectData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  console.log(formSelectData.attendanceDate);

  const handleChange = (studentId: any, status: any) => {
    setFormSelectData((prevState) => ({
      ...prevState,
      attendance: {
        ...prevState.attendance,
        [studentId]: status,
      },
    }));
  };

  const { data: Data } = useStudentsAttendanceQuery({ ...query });
  const studentAttendanceData = Data?.attendences;
  console.log(studentAttendanceData);

  const { data, isLoading } = useStudentsQuery({ ...query });
  const studentData = data?.students;

  const studentDataFilterByClassName: any = studentData?.filter(
    (student: any) => student?.admission === studentClassTitle
  );

  const dateString = formSelectData?.attendanceDate;
  let attendanceDateInfo: IAttendance | undefined;

  if (dateString) {
    const dateObject = new Date(dateString);
    if (!isNaN(dateObject.getTime())) {
      const isoString = dateObject?.toISOString();
      console.log(isoString);
      attendanceDateInfo = studentAttendanceData?.find(
        (dateInfo: any) => dateInfo?.attendanceDate === isoString
      );
    }
  }

  console.log(attendanceDateInfo);

  const [addStudentAttendanceWithFormData] =
    useAddStudentAttendanceWithFormDataMutation();

  const handleAttendence = async (e: any) => {
    e.preventDefault();
    const StudentAttendanceInfo = {
      attendanceDate: formSelectData.attendanceDate,
      attendance: formSelectData.attendance,
    };

    try {
      const res = await addStudentAttendanceWithFormData(
        StudentAttendanceInfo
      ).unwrap();
      console.log(res);
      if (res.count) {
        toast.success("Attendance Report Saved");
      }
    } catch (error) {
      console.error("Failed to submit attendance", error);
    }
  };

  return (
    <>
      {studentDataFilterByClassName?.length > 0 ? (
        <form onSubmit={handleAttendence}>
          <div className="flex flex-col mt-12">
            <div className="flex items-center justify-start mb-4gbhn">
              <label>Date:</label>
              <input
                type="date"
                name="attendanceDate"
                value={formSelectData?.attendanceDate}
                onChange={handleChangeDate}
                className="w-46 ms-4 border border-1 border-gray-300 bg-white px-4 text-base text-[#6B7280]  focus:outline-none"
              />
            </div>
            <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle">
                <div className="overflow-hidden  mt-4">
                  <table
                    ref={componentRef}
                    className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700"
                  >
                    <thead>
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-sm font-semibold text-gray-500 dark:text-neutral-500"
                        >
                          SL
                        </th>

                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-sm font-semibold text-gray-500 dark:text-neutral-500"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-sm font-semibold text-gray-500 dark:text-neutral-500"
                        >
                          Class Name
                        </th>

                        <th
                          scope="col"
                          className="px-6 py-3 text-start text-sm font-semibold text-gray-500 dark:text-neutral-500"
                        >
                          Roll No
                        </th>

                        <th
                          scope="col"
                          className="px-6 py-3 text-sm font-semibold text-gray-500 dark:text-neutral-500"
                        >
                          Attendence
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {studentDataFilterByClassName?.map(
                        (SInfo: any, i: any) => {
                          return (
                            <>
                              <tr key={SInfo.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                  {i + 1}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                  {SInfo.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                  {SInfo.admission}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                  {SInfo.roll}
                                </td>

                                <td className="ps-10 py-4 whitespace-nowrap text-sm font-medium">
                                  <input
                                    type="radio"
                                    name={`student-${SInfo.id}`}
                                    value="Present"
                                    onChange={() =>
                                      handleChange(SInfo.id, "Present")
                                    }
                                  />
                                  <label>Present</label>
                                  <input
                                    className="ms-3"
                                    type="radio"
                                    name={`student-${SInfo.id}`}
                                    value="Absent"
                                    onChange={() =>
                                      handleChange(SInfo.id, "Absent")
                                    }
                                  />
                                  <label>Absent</label>
                                </td>
                              </tr>
                            </>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-start mt-16">
            {attendanceDateInfo?.attendanceDate ? (
              <button className="hidden">Report</button>
            ) : (
              <button className="hover:bg-orange-500 w-[100px] rounded bg-orange-400 py-2 text-center text-base font-semibold text-white  focus:outline-none">
                Report
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="flex justify-center items-center mt-24 pb-20">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-24 text-sky-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
            <h2 className="text-gray-600 font-medium text-xl ms-2">No Data</h2>
          </div>
        </div>
      )}
    </>
  );
};
export default StudentAttendenceList;
