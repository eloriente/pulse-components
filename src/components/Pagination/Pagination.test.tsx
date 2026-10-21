import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Pagination, getPaginationRange } from './Pagination';

describe('getPaginationRange', () => {
  it('returns every page when the total fits without collapsing', () => {
    expect(getPaginationRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('shows a right ellipsis when near the start', () => {
    expect(getPaginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 20]);
  });

  it('shows a left ellipsis when near the end', () => {
    expect(getPaginationRange(20, 20)).toEqual([1, 'ellipsis', 16, 17, 18, 19, 20]);
  });

  it('shows both ellipses when in the middle', () => {
    expect(getPaginationRange(10, 20)).toEqual([1, 'ellipsis', 9, 10, 11, 'ellipsis', 20]);
  });

  it('respects a custom siblingCount', () => {
    expect(getPaginationRange(10, 20, 2)).toEqual([1, 'ellipsis', 8, 9, 10, 11, 12, 'ellipsis', 20]);
  });

  it('always keeps the first and last page visible', () => {
    const result = getPaginationRange(10, 20);
    expect(result[0]).toBe(1);
    expect(result[result.length - 1]).toBe(20);
  });
});

describe('Pagination', () => {
  describe('Rendering', () => {
    it('renders a nav landmark labelled "Pagination"', () => {
      render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
      expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    });

    it('marks the current page with aria-current', () => {
      render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);
      expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    it('disables Previous on the first page', () => {
      render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
      expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    });

    it('disables Next on the last page', () => {
      render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />);
      expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    });

    it('renders ellipses for large page counts', () => {
      render(<Pagination currentPage={10} totalPages={20} onPageChange={() => {}} />);
      expect(screen.getAllByText('…')).toHaveLength(2);
    });
  });

  describe('Interactions', () => {
    it('calls onPageChange when a page number is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);
      await user.click(screen.getByRole('button', { name: 'Page 3' }));
      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('calls onPageChange with currentPage + 1 when Next is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);
      await user.click(screen.getByRole('button', { name: 'Next page' }));
      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('calls onPageChange with currentPage - 1 when Previous is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);
      await user.click(screen.getByRole('button', { name: 'Previous page' }));
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('does not call onPageChange when clicking the already-current page', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);
      await user.click(screen.getByRole('button', { name: 'Page 3' }));
      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('First/Last buttons', () => {
    it('does not render them by default', () => {
      render(<Pagination currentPage={5} totalPages={20} onPageChange={() => {}} />);
      expect(screen.queryByRole('button', { name: 'First page' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Last page' })).not.toBeInTheDocument();
    });

    it('jumps to page 1 when First is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <Pagination currentPage={10} totalPages={20} onPageChange={onPageChange} showFirstLast />,
      );
      await user.click(screen.getByRole('button', { name: 'First page' }));
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('jumps to the last page when Last is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(
        <Pagination currentPage={10} totalPages={20} onPageChange={onPageChange} showFirstLast />,
      );
      await user.click(screen.getByRole('button', { name: 'Last page' }));
      expect(onPageChange).toHaveBeenCalledWith(20);
    });

    it('disables First on the first page and Last on the last page', () => {
      const { rerender } = render(
        <Pagination currentPage={1} totalPages={20} onPageChange={() => {}} showFirstLast />,
      );
      expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Last page' })).toBeEnabled();

      rerender(
        <Pagination currentPage={20} totalPages={20} onPageChange={() => {}} showFirstLast />,
      );
      expect(screen.getByRole('button', { name: 'First page' })).toBeEnabled();
      expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled();
    });
  });

  describe('Styling', () => {
    it('applies a custom className', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={() => {}}
          className="my-pagination"
        />,
      );
      expect(screen.getByRole('navigation').className).toContain('my-pagination');
    });
  });
});
