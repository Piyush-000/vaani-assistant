type Props = {
  history: string[];
};

export default function CommandHistory({ history }: Props) {
  return (
    <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-4 text-2xl font-semibold">
        Recent Commands
      </h2>

      {history.length === 0 ? (
        <p className="text-zinc-400">
          No commands executed yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {history.map((item, index) => (
            <li
              key={index}
              className="rounded-lg bg-zinc-800 px-4 py-2"
            >
              ✔ {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}