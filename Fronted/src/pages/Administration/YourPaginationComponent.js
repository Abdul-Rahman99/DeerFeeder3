import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap'; // Replace with your pagination library

const YourPaginationComponent = ({ totalRows, totalPages, currentPage, onPageChange }) => {
    const renderPagination = () => {
        const pages = [];

        const pageLimit = 5; // Number of buttons to display
        const ellipsis = <span className="ellipsis">...</span>;

        // Calculate the start and end indices for the visible buttons
        let start = Math.max(1, currentPage - Math.floor(pageLimit / 2));
        let end = Math.min(totalPages, start + pageLimit - 1);

        // Adjust start and end when currentPage is close to the beginning or end
        if (end - start + 1 < pageLimit) {
            start = Math.max(1, end - pageLimit + 1);
        }

        // Display ellipsis at the beginning if there are more pages before the visible buttons
        if (start > 1) {
            pages.push(
                <PaginationItem key="ellipsis-start" disabled>
                    {ellipsis}
                </PaginationItem>
            );
        }

        // Render visible buttons
        for (let i = start; i <= end; i++) {
            pages.push(
                <PaginationItem key={i} active={i === currentPage}>
                    <PaginationLink onClick={() => onPageChange(i)}>{i}</PaginationLink>
                </PaginationItem>
            );
        }

        // Display ellipsis at the end if there are more pages after the visible buttons
        if (end < totalPages) {
            pages.push(
                <PaginationItem key="ellipsis-end" disabled>
                    {ellipsis}
                </PaginationItem>
            );
        }

        return pages;
    };

    return (
        <Pagination listClassName="justify-content-center" className="pagination-separated mb-0 mt-4">
            <PaginationItem disabled={currentPage === 1}>
                <PaginationLink onClick={() => onPageChange(currentPage - 1)}>
                    <i className="mdi mdi-chevron-left" />
                </PaginationLink>
            </PaginationItem>
            {renderPagination()}
            <PaginationItem disabled={currentPage === totalPages}>
                <PaginationLink onClick={() => onPageChange(currentPage + 1)}>
                    <i className="mdi mdi-chevron-right" />
                </PaginationLink>
            </PaginationItem>
        </Pagination>
    );
};

export default YourPaginationComponent;
