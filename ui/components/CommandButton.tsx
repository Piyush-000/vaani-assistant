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
      type="button"
      onClick={onClick}
      className="
        group
        flex
        min-h-[72px]
        w-full
        items-center
        justify-center
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-950
        px-4
        py-4
        text-center
        text-base
        font-semibold
        text-zinc-200
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-zinc-600
        hover:bg-zinc-800
        hover:text-white
        hover:shadow-lg
        active:translate-y-0
        active:scale-[0.98]
        focus:outline-none
        focus:ring-2
        focus:ring-zinc-500
        focus:ring-offset-2
        focus:ring-offset-zinc-900
        sm:text-lg
      "
    >
      <span className="transition-transform duration-200 group-hover:scale-105">
        {label}
      </span>
    </button>
  );
}