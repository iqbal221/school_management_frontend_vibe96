"use client";

import {  useState } from "react";
import Link from "next/link";
import DeleteFeesConfirmationModal from "../Modal/DeleteFeesConfirmationModal";
import {
  useAddAuthorizationDataMutation,
  useAuthorizationsQuery,
  useUpdateAuthorizationMutation,
} from "@/redux/api/authorizationApi";
import { toast } from "react-toastify";
import { getUserInfo } from "@/service/auth.service";

const PaymentHistory = ({ componentRef, paymentHistoryInfo }: any) => {
  const query: Record<string, any> = {};
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFees, setDeleteFees] = useState("");

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");

  query["limit"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;

  // get user info from token
  const UserInfo: any = getUserInfo();

  const { data, isLoading } = useAuthorizationsQuery({ ...query });

  const authorizationData: any = data?.Authorizations;

  const [addAuthorizationData] = useAddAuthorizationDataMutation();

  const [updateAuthorization] = useUpdateAuthorizationMutation();

  const handleDeleteFunctionality = async (paymentInfo: any) => {
    const { id } = paymentInfo;

    let obj = {} as any;
    obj.studentId = id;
    obj.status = true;

    try {
      const res = await addAuthorizationData(obj).unwrap();
      console.log(res);

      if (res.id) {
        toast.success("Send Authorized Approval");
      }
    } catch (err) {
      toast.error("Message send failed");
    }
  };

  const handleApproval = async (approvalData: any) => {
    const { id } = approvalData;

    let obj = {} as any;
    obj.approval = true;
    obj.status = false;
    // obj.fees = fees;

    console.log(obj);

    try {
      const res = await updateAuthorization({
        id,
        data: obj,
      }).unwrap();
      console.log(res);

      if (res.id) {
        toast.success("Request Approved");
      }
    } catch (err) {
      toast.error("Message send failed");
    }
  };

  const handleDelete = (id: any) => {
    setDeleteFees(id);
    setShowDeleteModal(true);
  };

  return (
    <>
      <div>
        {paymentHistoryInfo?.length > 0 ? (
          <>
            <div className="flex flex-col">
              <div className="-m-1.5 overflow-x-auto">
                <div className="p-1.5 min-w-full inline-block align-middle">
                  <div className="overflow-hidden  mt-6">
                    <table
                      ref={componentRef}
                      className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700"
                    >
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-sm font-medium text-gray-500 dark:text-neutral-500"
                          >
                            SL
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-sm font-medium text-gray-500 dark:text-neutral-500"
                          >
                            Payment Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-sm font-medium text-gray-500 dark:text-neutral-500"
                          >
                            Fees Type
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-sm font-medium text-gray-500 dark:text-neutral-500"
                          >
                            Fees
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-start text-sm font-medium text-gray-500 dark:text-neutral-500"
                          >
                            Amount(TK)
                          </th>

                          <th
                            scope="col"
                            className="px-6 py-3 text-end text-sm font-medium text-gray-500 dark:text-neutral-500"
                          >
                            Voucher
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-end text-sm font-medium text-gray-500 dark:text-neutral-500"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                        {paymentHistoryInfo?.map((paymentInfo: any, i: any) => {
                          const date = new Date(paymentInfo.entryDate);

                          // Extracting the date components
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0"
                          ); // Adding 1 because months are zero-indexed
                          const day = String(date.getDate()).padStart(2, "0");
                          const stringDate = `${day}-${month}-${year}`;

                          const authorization: any = authorizationData?.find(
                            (item: any) =>
                              item.studentId === paymentInfo.id &&
                              item.status === true &&
                              item.approval === false
                          );

                          const authorizationApproved: any =
                            authorizationData?.find(
                              (item: any) =>
                                item.studentId === paymentInfo.id &&
                                item.status === false &&
                                item.approval === true
                            );

                          return (
                            <>
                              <tr key={i}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                  {i + 1}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                  {stringDate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                  {paymentInfo.feesType}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                  {paymentInfo.fees}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                                  {paymentInfo.amount}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                  <Link
                                    href={`/feesManagement/moneyReceipt/${paymentInfo.id}`}
                                  >
                                    <button className="py-1 px-1 bg-blue-400 text-sm text-white hover:shadow-md transition dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
                                      Voucher
                                    </button>
                                  </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                                  {UserInfo?.userRole === "admin" && (
                                    <>
                                      {authorization && (
                                        <button className="text-blue-500 shadow-md py-1 px-2 font-medium rounded">
                                          Wait approval
                                        </button>
                                      )}
                                      {authorizationApproved && (
                                        <button
                                          onClick={() =>
                                            handleDelete(paymentInfo.id)
                                          }
                                          className="shadow-md py-1 px-2 text-red-600 font-medium rounded"
                                        >
                                          Ready for delete
                                        </button>
                                      )}

                                      {!authorization &&
                                        !authorizationApproved && (
                                          <button
                                            onClick={() =>
                                              handleDeleteFunctionality(
                                                paymentInfo
                                              )
                                            }
                                            type="button"
                                            className="shadow-md py-1 px-2 text-red-500 inline-flex items-center gap-x-2 text-sm font-medium rounded border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400"
                                          >
                                            Delete
                                          </button>
                                        )}
                                    </>
                                  )}
                                  {UserInfo?.userRole === "super_admin" && (
                                    <>
                                      {authorization && (
                                        <button
                                          onClick={() =>
                                            handleApproval(authorization)
                                          }
                                          className="shadow-md py-1 px-2 text-blue-500 font-medium rounded"
                                        >
                                          Wait approval
                                        </button>
                                      )}
                                      {authorizationApproved && (
                                        <button className="shadow-md py-1 px-2 text-green-500 font-medium rounded">
                                          Approved
                                        </button>
                                      )}

                                      {!authorization &&
                                        !authorizationApproved && (
                                          <button
                                            onClick={() =>
                                              handleDelete(paymentInfo.id)
                                            }
                                            type="button"
                                            className="shadow-md py-1 px-2 text-red-500 inline-flex items-center gap-x-2 text-sm font-semibold rounded border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400"
                                          >
                                            Delete
                                          </button>
                                        )}
                                    </>
                                  )}
                                </td>
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center my-20">
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

      <DeleteFeesConfirmationModal
        deleteFeesId={deleteFees}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
      ></DeleteFeesConfirmationModal>
    </>
  );
};
export default PaymentHistory;
