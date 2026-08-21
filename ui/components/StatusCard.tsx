"use client";

type Props = {
  message: string;
};

export default function StatusCard({
  message,
}: Props) {
  const normalizedMessage =
    message.trim().toLowerCase();

  const isError =
    normalizedMessage.includes("error") ||
    normalizedMessage.includes("unable") ||
    normalizedMessage.includes("don't") ||
    normalizedMessage.includes("not found") ||
    normalizedMessage.includes("denied") ||
    normalizedMessage.includes("failed") ||
    normalizedMessage.includes("no previous");

  const isLoading =
    normalizedMessage.includes("opening") ||
    normalizedMessage.includes("listening");

  const isSuccess =
    !isError &&
    !isLoading &&
    (
      normalizedMessage.includes(
        "successfully"
      ) ||
      normalizedMessage.includes("opened") ||
      normalizedMessage.includes(
        "cleared"
      ) ||
      normalizedMessage.includes(
        "previous command"
      ) ||
      normalizedMessage.includes(
        "last opened"
      )
    );

  let indicator = "●";
  let indicatorClass = "text-zinc-500";
  let messageClass = "text-zinc-300";

  if (isError) {
    indicator = "●";
    indicatorClass = "text-red-500";
    messageClass = "text-red-400";
  } else if (isLoading) {
    indicator = "●";
    indicatorClass =
      "animate-pulse text-yellow-400";
    messageClass = "text-yellow-300";
  } else if (isSuccess) {
    indicator = "●";
    indicatorClass = "text-green-500";
    messageClass = "text-green-400";
  }

  return (
    <section
      className="
        mt-6
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        p-5
        shadow-lg
      "
    >
      <div className="flex items-center justify-between gap-4">

        <div className="flex items-center gap-3">

          <span
            aria-hidden="true"
            className={`text-sm ${indicatorClass}`}
          >
            {indicator}
          </span>

          <h2 className="text-lg font-semibold text-white">
            Status
          </h2>

        </div>

        <span className="text-xs uppercase tracking-wider text-zinc-600">
          Vaani
        </span>

      </div>

      <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-4">

        <p
          aria-live="polite"
          className={`text-sm leading-6 sm:text-base ${messageClass}`}
        >
          {message || "Ready..."}
        </p>

      </div>
    </section>
  );
}