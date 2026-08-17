import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { sprintService } from '../../../services';
import { Spinner } from '../../common/States';

export default function BurndownChart({ sprintId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sprintId) return;
    setLoading(true);
    sprintService
      .burndown(sprintId)
      .then(({ data }) => setData(data.data))
      .finally(() => setLoading(false));
  }, [sprintId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (!data || data.chart.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-12">Not enough data for a burndown chart yet.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-xl font-bold">{data.totalPoints}</p>
          <p className="text-xs text-gray-400">Total points</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-emerald-600">{data.completedPoints}</p>
          <p className="text-xs text-gray-400">Completed</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
          <p className="text-xl font-bold text-amber-600">{data.remainingPoints}</p>
          <p className="text-xs text-gray-400">Remaining</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data.chart}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-gray-800" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="ideal" stroke="#9CA3AF" strokeDasharray="4 4" dot={false} name="Ideal" />
          <Line type="monotone" dataKey="actual" stroke="#6366F1" strokeWidth={2} dot={{ r: 3 }} name="Actual" connectNulls={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
