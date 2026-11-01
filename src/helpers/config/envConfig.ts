export const getBaseUrl = (): string => {
  return (
    process.env.BASE_URL ||
    // "https://school-management-backend-codecanyon.vercel.app/api/v1"
    "http://localhost:5000/api/v1"
  );
};
getBaseUrl();
