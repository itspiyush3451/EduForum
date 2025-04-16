const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">Unauthorized</h1>
      <p className="text-lg text-gray-700 mt-2">
        You do not have permission to access this page.
      </p>
      <a
        href="/dashboard"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Go to Dashboard
      </a>
    </div>
  );
};

export default Unauthorized;
