import React from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import "../styles/Breadcrumb.css"

type BreadcrumbItem = {
    label: string;
    href?: string;
};

type Props = {
    items: BreadcrumbItem[];
};

const Breadcrumb = ({ items }: Props) => {
    return (
        <nav aria-label="breadcrumb" className="breadcrumb">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <React.Fragment key={index}>
                        {item.href && !isLast ? (
                            <Link to={item.href} className="breadcrumb-link">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="breadcrumb-current">{item.label}</span>
                        )}

                        {!isLast && (
                            <FaChevronRight
                                size={12}
                                className="breadcrumb-separator"
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;