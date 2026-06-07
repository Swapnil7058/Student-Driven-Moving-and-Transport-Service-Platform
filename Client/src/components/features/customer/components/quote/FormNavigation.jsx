export default function FormNavigation({
  currentStep,
  steps,
  handleNext,
  handleBack,
}) {

  return (

    <div className="flex justify-end gap-3 mt-8">

      {currentStep > 1 && (
        <button
          type="button"
          onClick={handleBack}
          className="px-5 py-2 bg-gray-400 text-white rounded-lg"
        >
          Back
        </button>
      )}

      {currentStep < steps.length && (
        <button
          type="button"
          onClick={handleNext}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Next
        </button>
      )}

      {currentStep === steps.length && (
        <button
          type="submit"
          className="px-5 py-2 bg-green-600 text-white rounded-lg"
        >
          Submit Quote
        </button>
      )}

    </div>
  );
}