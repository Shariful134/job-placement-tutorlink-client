const Loading = () => {
  return (
    <div className="h-screen w-full grid place-items-center">
      <div className="flex flex-col justify-center items-center space-x-1 gap-3 md:gap-5">
        <div>Loading...</div>
        <div className="flex  justify-center items-center space-x-1">
          <div className="h-3 w-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="h-3 w-3 bg-blue-500 rounded-full animate-bounce delay-150"></div>
          <div className="h-3 w-3 bg-blue-500 rounded-full animate-bounce delay-300"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
