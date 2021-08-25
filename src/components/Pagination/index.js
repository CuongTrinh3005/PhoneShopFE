import React from 'react';

const Pagination = ({ itemPerPage, totalItems, paginate }) => {
    const pageNumbers = [];

    for (let index = 1; index <= Math.ceil(totalItems / itemPerPage); index++) {
        pageNumbers.push(index);
    }
    return (
        <nav style={{ marginTop: "2rem" }, { marginLeft: "46rem" }}>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <a className="page-link" onClick={() => paginate(number)}>
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Pagination;