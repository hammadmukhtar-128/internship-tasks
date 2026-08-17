import React from 'react';
import { ArrowDown, Minus, ArrowUp, AlertTriangle } from 'lucide-react';

const statusStyles = {
  'To Do': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'In Review': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Done: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Planning: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  Active: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'On Hold': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Archived: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
};

export function StatusBadge({ status, className = '' }) {
  return <span className={`badge ${statusStyles[status] || statusStyles['To Do']} ${className}`}>{status}</span>;
}

const priorityStyles = {
  Low: { cls: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300', Icon: ArrowDown },
  Medium: { cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', Icon: Minus },
  High: { cls: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', Icon: ArrowUp },
  Urgent: { cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300', Icon: AlertTriangle },
};

export function PriorityBadge({ priority, className = '' }) {
  const { cls, Icon } = priorityStyles[priority] || priorityStyles.Medium;
  return (
    <span className={`badge ${cls} ${className}`}>
      <Icon size={11} />
      {priority}
    </span>
  );
}

export function LabelBadge({ label }) {
  return (
    <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 border border-brand-100 dark:border-brand-900">
      {label}
    </span>
  );
}
