import React from 'react';

interface PaginationProps {
  page?: number;
  pageSize?: number;
  totalCount?: number;
  onChange?: (nextPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page = 1,
  pageSize = 15,
  totalCount = 0,
  onChange,
}) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const go = (p: number) => {
    if (p < 1 || p > totalPages) return;
    if (onChange) onChange(p);
  };

  const buildPages = () => {
    const pages: Array<{ type: 'page' | 'dots'; value?: number }> = [];
    const push = (n: number) => pages.push({ type: 'page', value: n });
    const dots = () => pages.push({ type: 'dots' });

    // 모바일/태블릿: 3개 단위로 표시
    if (isMobile) {
      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) push(i);
      } else {
        // 현재 페이지가 앞쪽에 있을 때
        if (page <= 2) {
          push(1);
          push(2);
          push(3);
          dots();
          push(totalPages);
        }
        // 현재 페이지가 뒤쪽에 있을 때
        else if (page >= totalPages - 1) {
          push(1);
          dots();
          push(totalPages - 2);
          push(totalPages - 1);
          push(totalPages);
        }
        // 현재 페이지가 중간에 있을 때
        else {
          push(1);
          dots();
          push(page - 1);
          push(page);
          push(page + 1);
          dots();
          push(totalPages);
        }
      }
    }
    // 데스크톱: 5개 단위로 표시
    else {
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) push(i);
      } else {
        // 현재 페이지가 앞쪽에 있을 때
        if (page <= 4) {
          for (let i = 1; i <= 5; i++) push(i);
          dots();
          push(totalPages);
        }
        // 현재 페이지가 뒤쪽에 있을 때
        else if (page >= totalPages - 3) {
          push(1);
          dots();
          for (let i = totalPages - 4; i <= totalPages; i++) push(i);
        }
        // 현재 페이지가 중간에 있을 때
        else {
          push(1);
          dots();
          push(page - 1);
          push(page);
          push(page + 1);
          dots();
          push(totalPages);
        }
      }
    }
    return pages;
  };

  const pages = buildPages();

  return (
    <div className="w-full flex justify-center items-center gap-2 select-none my-8">
      {/* Prev Button */}
      <button
        className="w-8 h-8 flex items-center justify-center text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 rounded transition-colors"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        aria-label="이전 페이지"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <path d="M12 15L7 10L12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((item, idx) =>
          item.type === 'dots' ? (
            <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-gray-400">
              ⋯
            </span>
          ) : (
            <button
              key={`p-${item.value}`}
              onClick={() => go(item.value!)}
              className={`w-8 h-8 flex items-center justify-center text-sm rounded transition-colors ${
                item.value === page
                  ? 'bg-black text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.value}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        className="w-8 h-8 flex items-center justify-center text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 rounded transition-colors"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        aria-label="다음 페이지"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <path d="M8 5L13 10L8 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};