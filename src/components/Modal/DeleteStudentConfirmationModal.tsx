import { useDeleteStudentMutation } from "@/redux/api/studentApi";
import React from "react";
import { toast } from "react-toastify";

const DeleteConfirmationModal = ({
  deleteStudentId,
  showDeleteModal,
  setShowDeleteModal,
}: any) => {
  const [deleteStudent] = useDeleteStudentMutation();

  const handleConfirmDelete = async () => {
    try {
      const res = await deleteStudent(deleteStudentId).unwrap();
      console.log(res);
      if (res.id) {
        toast.success("Student Delete Successfully");
        setShowDeleteModal(false);
      }
    } catch (err) {
      toast.error("Student Delete Failed");
    }
  };
  return (
    <div>
      <div>
        {showDeleteModal ? (
          <>
            <div className="overflow-y-auto md:ms-24 mx-auto h-auto justify-center items-center flex fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative mx-auto w-[450px] md:px-0 px-4">
                {/*content*/}

                <div className="pb-2 flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70">
                  <div className="flex justify-center items-center mt-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-14 h-14 text-yellow-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>

                  <div className="p-4 overflow-y-auto text-center">
                    <h3 className="text-3xl font-semibold text-gray-500">
                      Are you sure ?
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                      You wont be able to revert this
                    </p>
                  </div>
                  <div className="flex justify-center items-center gap-x-2 py-5 px-4 border-t dark:border-neutral-700">
                    <button
                      onClick={handleConfirmDelete}
                      type="button"
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Yes, delete it!
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      type="button"
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
