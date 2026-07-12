import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-black/5 px-1 py-4">
      <p className="text-sm text-ink/50">
        Page <span className="font-semibold text-ink">{page}</span> of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          className="btn-secondary !px-3 !py-1.5"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <button
          className="btn-secondary !px-3 !py-1.5"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
