interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-full flex flex-col items-center justify-center">
        <button
          onClick={onStart}
          className="w-48 py-4 px-8 bg-[#A8B0CD] text-white rounded-lg text-lg font-semibold hover:bg-[#9BA3C0] transition-colors"
        >
          Try me!
        </button>
      </div>
    </div>
  );
} 