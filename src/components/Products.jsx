import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Pagination,
  Spinner,
  Dropdown,
} from "react-bootstrap";
import {
  fetchProducts,
  setSearchQuery,
  setSelectedCategory,
  setSorting,
  setPage,
} from "../store/Slices/productsSlice";
import ProductCard from "./ProductCard";
import CategoryList from "./CategoryList";
import {
  FaSearch,
  FaTimes,
  FaSortAmountDown,
  FaRedo,
  FaBoxes,
} from "react-icons/fa";

export default function Products() {
  const dispatch = useDispatch();
  const {
    items,
    total,
    skip,
    limit,
    selectedCategory,
    searchQuery,
    sortBy,
    sortOrder,
    loading,
    error,
  } = useSelector((state) => state.products);
  const isDark = useSelector((state) => state.theme.isDark);

  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  // Load products when filters or pagination changes
  useEffect(() => {
    dispatch(
      fetchProducts({
        limit,
        skip,
        searchQuery,
        category: selectedCategory,
        sortBy,
        order: sortOrder,
      })
    );
  }, [dispatch, limit, skip, searchQuery, selectedCategory, sortBy, sortOrder]);

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    dispatch(setSearchQuery(""));
  };

  // Handle Sorting change
  const handleSortSelect = (value) => {
    switch (value) {
      case "price-asc":
        dispatch(setSorting({ sortBy: "price", order: "asc" }));
        break;
      case "price-desc":
        dispatch(setSorting({ sortBy: "price", order: "desc" }));
        break;
      case "rating-desc":
        dispatch(setSorting({ sortBy: "rating", order: "desc" }));
        break;
      case "title-asc":
        dispatch(setSorting({ sortBy: "title", order: "asc" }));
        break;
      case "title-desc":
        dispatch(setSorting({ sortBy: "title", order: "desc" }));
        break;
      default:
        dispatch(setSorting({ sortBy: "default", order: "asc" }));
    }
  };

  // Get current sort label
  const getSortLabel = () => {
    if (sortBy === "price" && sortOrder === "asc") return "Price: Low to High";
    if (sortBy === "price" && sortOrder === "desc") return "Price: High to Low";
    if (sortBy === "rating") return "Top Rated";
    if (sortBy === "title" && sortOrder === "asc") return "Title: A to Z";
    if (sortBy === "title" && sortOrder === "desc") return "Title: Z to A";
    return "Featured / Default";
  };

  // Calculate pagination
  const currentPage = Math.floor(skip / limit);
  const totalPages = Math.ceil(total / limit) || 1;

  const renderPaginationItems = () => {
    const items = [];
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    if (startPage > 0) {
      items.push(
        <Pagination.Item key={0} active={currentPage === 0} onClick={() => dispatch(setPage(0))}>
          1
        </Pagination.Item>
      );
      if (startPage > 1) {
        items.push(<Pagination.Ellipsis key="ellipsis-start" disabled />);
      }
    }

    for (let p = startPage; p <= endPage; p++) {
      items.push(
        <Pagination.Item
          key={p}
          active={p === currentPage}
          onClick={() => dispatch(setPage(p))}
        >
          {p + 1}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        items.push(<Pagination.Ellipsis key="ellipsis-end" disabled />);
      }
      items.push(
        <Pagination.Item
          key={totalPages - 1}
          active={currentPage === totalPages - 1}
          onClick={() => dispatch(setPage(totalPages - 1))}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <Container className="py-4">
      {/* Header and Controls */}
      <div className="d-flex flex-column gap-3 mb-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h1 className="fw-bold mb-1 fs-2">Browse Products</h1>
            <p className="text-muted mb-0 small">
              Discover quality products with unbeatable prices & instant delivery
            </p>
          </div>

          {/* Quick summary badge */}
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill">
              <FaBoxes className="me-1" />
              {total} Products Available
            </span>
          </div>
        </div>

        {/* Search & Sort Bar */}
        <Row className="g-3 align-items-center">
          <Col md={7} lg={8}>
            <Form onSubmit={handleSearchSubmit}>
              <InputGroup className="shadow-sm rounded-pill overflow-hidden border">
                <InputGroup.Text
                  className={`border-0 bg-transparent ps-3 ${
                    isDark ? "text-white" : "text-muted"
                  }`}
                >
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search products by title, brand, or keywords..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className={`border-0 shadow-none py-2 ${
                    isDark ? "bg-dark text-white" : "bg-white"
                  }`}
                />
                {localSearch && (
                  <Button
                    variant="link"
                    className="text-muted pe-2 text-decoration-none"
                    onClick={handleClearSearch}
                  >
                    <FaTimes />
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  className="px-4 rounded-pill m-1"
                >
                  Search
                </Button>
              </InputGroup>
            </Form>
          </Col>

          {/* Sort Dropdown */}
          <Col md={5} lg={4} className="d-flex justify-content-md-end gap-2">
            <Dropdown onSelect={handleSortSelect} className="w-100 w-md-auto">
              <Dropdown.Toggle
                variant={isDark ? "outline-light" : "outline-secondary"}
                id="dropdown-sort"
                className="w-100 rounded-pill px-3 py-2 d-flex align-items-center justify-content-between shadow-sm"
              >
                <span className="d-flex align-items-center gap-2">
                  <FaSortAmountDown />
                  <span className="small fw-semibold">{getSortLabel()}</span>
                </span>
              </Dropdown.Toggle>

              <Dropdown.Menu
                className={`shadow-lg rounded-3 ${isDark ? "dropdown-menu-dark" : ""}`}
              >
                <Dropdown.Header>Sort Products</Dropdown.Header>
                <Dropdown.Item eventKey="default">Featured / Default</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="price-asc">Price: Low to High</Dropdown.Item>
                <Dropdown.Item eventKey="price-desc">Price: High to Low</Dropdown.Item>
                <Dropdown.Item eventKey="rating-desc">Highest Rated</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="title-asc">Title: A to Z</Dropdown.Item>
                <Dropdown.Item eventKey="title-desc">Title: Z to A</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {(searchQuery || selectedCategory !== "all" || sortBy !== "default") && (
              <Button
                variant={isDark ? "outline-danger" : "outline-secondary"}
                className="rounded-pill px-3 shadow-sm"
                title="Reset Filters"
                onClick={() => {
                  setLocalSearch("");
                  dispatch(setSearchQuery(""));
                  dispatch(setSelectedCategory("all"));
                  dispatch(setSorting({ sortBy: "default", order: "asc" }));
                }}
              >
                <FaRedo />
              </Button>
            )}
          </Col>
        </Row>

        {/* Categories Pills */}
        <CategoryList activeCategory={selectedCategory} />
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" role="status" className="mb-3" />
          <p className="text-muted">Loading catalog products...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center p-4 rounded-4 shadow-sm">
          <h5>Error Loading Products</h5>
          <p className="mb-3">{error}</p>
          <Button
            variant="outline-danger"
            onClick={() =>
              dispatch(
                fetchProducts({
                  limit,
                  skip,
                  searchQuery,
                  category: selectedCategory,
                })
              )
            }
          >
            Try Again
          </Button>
        </div>
      ) : items.length === 0 ? (
        /* Empty state */
        <div className="text-center py-5 my-4">
          <div className="mb-3 text-muted display-4">🔍</div>
          <h3 className="fw-bold">No Products Found</h3>
          <p className="text-muted">
            We couldn't find any products matching your search or filters.
          </p>
          <Button
            variant="primary"
            className="rounded-pill px-4 mt-2"
            onClick={() => {
              setLocalSearch("");
              dispatch(setSearchQuery(""));
              dispatch(setSelectedCategory("all"));
            }}
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        /* Product Grid */
        <>
          <Row className="g-4 mb-4">
            {items.map((product) => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          {/* Pagination & Count */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 pt-3 border-top">
            <span className="text-muted small">
              Showing{" "}
              <strong className="text-body">
                {Math.min(skip + 1, total)} - {Math.min(skip + items.length, total)}
              </strong>{" "}
              of <strong className="text-body">{total}</strong> products
            </span>

            {totalPages > 1 && (
              <Pagination className="mb-0 shadow-sm rounded-pill overflow-hidden">
                <Pagination.Prev
                  disabled={currentPage === 0}
                  onClick={() => dispatch(setPage(currentPage - 1))}
                />
                {renderPaginationItems()}
                <Pagination.Next
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => dispatch(setPage(currentPage + 1))}
                />
              </Pagination>
            )}
          </div>
        </>
      )}
    </Container>
  );
}
