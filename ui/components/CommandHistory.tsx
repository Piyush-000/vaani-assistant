type CommandHistoryItem = {
  message: string;
  success: boolean;
  time: string;
};

type Props = {
  history: CommandHistoryItem[];
};

export default function CommandHistory({ history }: Props) {
  return (
    <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-5 text-2xl font-semibold">
        Recent Commands
      </h2>

      {history.length === 0 ? (
        <p className="text-zinc-400">
          No commands executed yet.
        </p>
      ) : (
        <div className="space-y-3">
          {history.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-xl ${
                    item.success ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {item.success ? "🟢" : "🔴"}
                </span>

                <span className="font-medium">
                  {item.message}
                </span>
              </div>

              <span className="text-sm text-zinc-500">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}