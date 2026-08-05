type Props = {
  message: string;
};

export default function StatusCard({ message }: Props) {
  return (
    <div className="mt-8 rounded-xl border border-gray-700 bg-zinc-900 p-5">
      <h2 className="mb-3 text-lg font-semibold text-white">
        Status
      </h2>

      <p className="text-green-400">
        {message}
      </p>
    </div>
  );
}