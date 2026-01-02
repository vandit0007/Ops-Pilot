function KanbanBoard({ issues, onStatusChange }) {
  const columns = [
    { key: "open", title: "Open" },
    { key: "in-progress", title: "In Progress" },
    { key: "closed", title: "Closed" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map((col) => (
        <div
          key={col.key}
          className="bg-neutral-900 border border-neutral-800 rounded-lg p-4"
        >
          <h2 className="font-semibold mb-4 text-white">
            {col.title}
          </h2>

          <div className="space-y-3">
            {issues
              .filter((i) => i.status === col.key)
              .map((issue) => (
                <div
                  key={issue._id}
                  className="p-3 rounded border border-neutral-700 bg-neutral-800"
                >
                  <h3 className="font-medium text-sm">
                    {issue.title}
                  </h3>

                  <p className="text-xs text-neutral-400 mt-1">
                    {issue.description}
                  </p>

                  <div className="mt-3 flex justify-end gap-2">
                    {columns
                      .filter((c) => c.key !== col.key)
                      .map((c) => (
                        <button
                          key={c.key}
                          onClick={() =>
                            onStatusChange(
                              issue._id,
                              c.key
                            )
                          }
                          className="text-xs px-2 py-1 rounded bg-neutral-700 hover:bg-neutral-600"
                        >
                          Move to {c.title}
                        </button>
                      ))}
                  </div>
                </div>
              ))}

            {issues.filter((i) => i.status === col.key)
              .length === 0 && (
              <p className="text-xs text-neutral-500">
                No issues
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default KanbanBoard;
