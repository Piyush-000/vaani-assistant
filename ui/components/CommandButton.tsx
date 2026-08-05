"use client";

type Props = {
  label: string;
  onClick: () => void;
};

export default function CommandButton({
  label,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="
        rounded-xl
        border
        border-zinc-700
        bg-zinc-800
        px-5
        py-4
        text-lg
        font-medium
        text-white
        transition-all
        hover:scale-105
        hover:border-blue-500
        hover:bg-blue-600
      "
    >
      {label}
    </button>
  );
}