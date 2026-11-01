import Image from "next/image";
import React, { useRef, useState } from "react";

const TeacherReport = ({ componentRef, attendanceInfo }: any) => {
  const query: Record<string, any> = {};

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("attendanceDate");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;

  const handleDateFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    if (type === "start") {
      setStartDate(date);
    } else if (type === "end") {
      setEndDate(date);
    }
  };

  console.log(attendanceInfo);

  const groupByTeacher = (data: any[]) => {
    const filteredData = data?.filter((item: any) => {
      const attendanceDate = new Date(item.attendanceDate);
      if (startDate && attendanceDate < startDate) {
        return false;
      }
      if (endDate && attendanceDate > endDate) {
        return false;
      }
      return true;
    });

    const grouped = filteredData?.reduce((acc, item) => {
      if (!acc[item.teacherId]) {
        acc[item.teacherId] = {
          teacher: item.teacher,
          attendanceRecords: [],
        };
      }
      acc[item.teacherId].attendanceRecords.push(item);
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const groupedAttendanceInfo = groupByTeacher(attendanceInfo);

  const filteredPresent: any = groupedAttendanceInfo?.reduce(
    (total: any, group: any) => {
      return (
        total +
        group.attendanceRecords.filter(
          (record: any) => record.status === "Present"
        ).length
      );
    },
    0
  );

  const filteredAbsent: any = groupedAttendanceInfo?.reduce(
    (total: any, group: any) => {
      return (
        total +
        group.attendanceRecords.filter(
          (record: any) => record.status === "Absent"
        ).length
      );
    },
    0
  );

  const filteredTotal: any = groupedAttendanceInfo.reduce(
    (total: any, group: any) => {
      return total + group.attendanceRecords.length;
    },
    0
  );

  console.log(filteredTotal);

  const attendancePercentage =
    filteredTotal > 0
      ? ((filteredPresent * 100) / filteredTotal).toFixed(2)
      : 0;

  return (
    <div>
      <div className="flex justify-start flex-wrap mt-6">
        <label>
          <span className="text-xs">Start Date:</span>
          <input
            type="date"
            onChange={(e) => handleDateFilterChange(e, "start")}
            className="border border-gray-300  md:px-4 px-2 block md:w-full w-36 bg-white outline-none  text-sm  focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:focus:ring-neutral-600"
          />
        </label>
        <label className="md:ml-4 ml-2">
          <span className="text-xs">End Date:</span>

          <input
            type="date"
            onChange={(e) => handleDateFilterChange(e, "end")}
            className="border border-gray-300  md:px-4 px-2 block md:w-full w-36 bg-white outline-none  text-sm  focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-transparent dark:text-neutral-400 dark:focus:ring-neutral-600"
          />
        </label>
      </div>
      <div ref={componentRef} className="flex justify-center">
        <div className="w-full mt-5">
          {groupedAttendanceInfo.length > 0 ? (
            groupedAttendanceInfo?.map((AInfo: any, index: any) => {
              return (
                <>
                  <div className="border" key={index}>
                    <h2 className="text-center text-lg text-gray-500 my-5 font-medium">
                      Attendance Report
                    </h2>

                    <div className="md:p-6 p-2 text-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col w-[350px]">
                          <h2 className="flex justify-between">
                            Name
                            <span className="w-2/3 font-medium decoration-dotted">
                              : {AInfo?.teacher.name}
                            </span>
                          </h2>

                          <h2 className="flex justify-between">
                            Designation
                            <span className="w-2/3 font-medium decoration-dotted">
                              : {AInfo?.teacher.designation}
                            </span>
                          </h2>

                          <h2 className="flex justify-between">
                            Contact
                            <span className="w-2/3 font-medium decoration-dotted">
                              : {AInfo?.teacher.contact}
                            </span>
                          </h2>
                        </div>
                        <Image
                          width={100}
                          height={150}
                          src={AInfo.teacher.image[0]}
                          className="w-16 h-16"
                          alt="profile_image"
                        />
                      </div>

                      <div className="md:mt-16 mt-10 grid md:grid-cols-10 sm:grid-cols-4 grid-cols-3">
                        {AInfo?.attendanceRecords?.map(
                          (record: any, recordIndex: any) => {
                            const date = new Date(record.attendanceDate);

                            // Extracting the date components
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0"
                            ); // Adding 1 because months are zero-indexed
                            const day = String(date.getDate()).padStart(2, "0");
                            const stringDate = `${day}-${month}-${year}`;

                            return (
                              <div
                                key={recordIndex}
                                className="flex-col border divide-y text-center mb-2"
                              >
                                <div>{stringDate}</div>
                                <div className="font-medium">
                                  {record.status === "Present" ? (
                                    <div className="text-green-500">
                                      {record.status}
                                    </div>
                                  ) : (
                                    <div className="text-red-500">
                                      {record.status}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                    <div className="flex justify-center font-bold text-sm mt-12 mb-4">
                      <span className="text-center">
                        Total Day: {filteredTotal}
                      </span>{" "}
                      <span className="mx-4 text-center">
                        Present: {filteredPresent}
                      </span>
                      <span className="text-center">
                        Absent: {filteredAbsent}
                      </span>{" "}
                      <span className="ms-4 text-md text-center">
                        Attendance: {attendancePercentage}%
                      </span>
                    </div>
                  </div>
                </>
              );
            })
          ) : (
            <div className="flex justify-center items-center mt-20 pb-16">
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
                <h2 className="text-gray-600 font-medium text-xl ms-2">
                  No Data
                </h2>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherReport;
