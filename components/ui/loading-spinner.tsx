/**
 * @component Loading spinner component with Tailwindcss
 */

export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full w-8 h-8 border-b-2 border-gray-900"></div>
    </div>
  );
};
