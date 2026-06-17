export const PromptInput = () => {
  return (
    <div className="bg-ink flex">
      <textarea
        rows={1}
        placeholder="Send a message..."
        className={
          "w-full resize-none bg-transparent px-4 py-3 font-body text-sm text-cream placeholder:text-cream/60 outline-none"
        }
      />
    </div>
  );
};
