type ErrorMessageProps = {
  message: string;
};

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div
      data-testid="error-message"
      className="border-l-2 border-red bg-cream px-4 py-3 font-body text-sm text-red"
    >
      {message}
    </div>
  );
};
