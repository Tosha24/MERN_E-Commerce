const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex flex-row items-center justify-center">
      <div
        className={`text-center ${step1 ? "text-green-500" : "text-gray-300"}`}
      >
        <span>In cart</span>
        {step1 && <div className="mt-2 text-lg">✅</div>}
      </div>

      {step2 && (
        <>
          {step1 && <div className="h-0.5 w-[5rem] bg-green-500"></div>}
          <div
            className={`text-center ${
              step2 ? "text-green-500" : "text-gray-300"
            }`}
          >
            <span>Shipping</span>
            {step2 && <div className="mt-2 text-lg">✅</div>}
          </div>
        </>
      )}

      {step3 && (
        <>
          {(step1 || step2) && (
            <div className="h-0.5 w-[5rem] bg-green-500"></div>
          )}
          <div
            className={`text-center ${
              step3 ? "text-green-500" : "text-gray-300"
            }`}
          >
            <span className={`${!(step1 || step2) ? "ml-[10rem]" : "ml-2"}`}>
              Payment
            </span>
            {step3 && <div className="mt-2 text-lg">✅</div>}
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressSteps;
