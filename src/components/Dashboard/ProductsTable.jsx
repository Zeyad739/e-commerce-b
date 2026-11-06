import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  Button,
  Badge,
  Form,
  InputGroup,
  Pagination,
  Spinner,
  Modal,
} from "react-bootstrap";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  addProductLocally,
  updateProductLocally,
  deleteProductLocally,
  setPage,
} from "../../store/Slices/productsSlice";
import ProductForm from "./Modals/ProductForm";
import { useNotification } from "../../utils/useNotification";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaStar,
} from "react-icons/fa";

export default function ProductsTable() {
  const dispatch = useDispatch();
  const notify = useNotification();
  const { items, total, skip, loading, categories } = useSelector(
    (state) => state.products
  );
  const isDark = useSelector((state) => state.theme.isDark);

  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Delete confirmation modal state
  const [deleteId, setDeleteId] = useState(null);

  // Load products for table
  useEffect(() => {
    dispatch(
      fetchProducts({
        limit: 10,
        skip,
        searchQuery: submittedSearch,
        category: selectedCat,
      })
    );
  }, [dispatch, skip, selectedCat, submittedSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSubmittedSearch(search);
    if (skip !== 0) dispatch(setPage(0));
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleFormSubmit = async (formData) => {
    setShowModal(false);
    if (editingProduct) {
      // Update existing
      dispatch(updateProductLocally(formData));
      dispatch(updateProduct({ id: editingProduct.id, data: formData }));
      notify.success(`Product "${formData.title}" updated successfully!`, "Product Updated");
    } else {
      // Add new
      dispatch(addProductLocally(formData));
      dispatch(addProduct(formData));
      notify.success(`Product "${formData.title}" added to catalog!`, "Product Created");
    }
  };

  const confirmDelete = () => {
    if (deleteId) {
      dispatch(deleteProductLocally(deleteId));
      dispatch(deleteProduct(deleteId));
      notify.success("Product deleted successfully!", "Product Deleted");
      setDeleteId(null);
    }
  };

  const currentPage = Math.floor(skip / 10);
  const totalPages = Math.ceil(total / 10) || 1;

  return (
    <div>
      {/* Header Controls */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div className="d-flex flex-wrap align-items-center gap-2 flex-grow-1">
          {/* Search */}
          <Form onSubmit={handleSearchSubmit} className="flex-grow-1" style={{ maxWidth: "320px" }}>
            <InputGroup size="sm" className="rounded-pill overflow-hidden border">
              <InputGroup.Text className="bg-transparent border-0 ps-3">
                <FaSearch className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-0 shadow-none"
              />
              {search && (
                <Button
                  variant="link"
                  size="sm"
                  className="text-muted text-decoration-none pe-2"
                  onClick={() => {
                    setSearch("");
                    setSubmittedSearch("");
                    if (skip !== 0) dispatch(setPage(0));
                  }}
                >
                  <FaTimes />
                </Button>
              )}
            </InputGroup>
          </Form>

          {/* Category Filter */}
          <Form.Select
            size="sm"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="rounded-pill border shadow-none text-capitalize"
            style={{ width: "auto" }}
          >
            <option value="all">All Categories</option>
            {categories?.map((cat) => {
              const slug = typeof cat === "string" ? cat : cat.slug;
              const name = typeof cat === "string" ? cat : cat.name;
              return (
                <option key={slug} value={slug}>
                  {name.replace(/-/g, " ")}
                </option>
              );
            })}
          </Form.Select>
        </div>

        {/* Add Product Button */}
        <Button
          variant="primary"
          onClick={handleOpenAdd}
          className="rounded-pill px-4 shadow-sm d-flex align-items-center gap-2"
        >
          <FaPlus size={13} />
          <span>Add New Product</span>
        </Button>
      </div>

      {/* Products Table */}
      <div className="border rounded-4 overflow-hidden shadow-sm bg-body">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">Loading products...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p className="mb-0">No products found matching criteria.</p>
          </div>
        ) : (
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: "60px" }}>Image</th>
                <th>Product Title</th>
                <th>Category</th>
                <th className="text-center">Price</th>
                <th className="text-center">Stock</th>
                <th className="text-center">Rating</th>
                <th className="text-center" style={{ width: "120px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((prod) => (
                <tr key={prod.id}>
                  <td>
                    <img
                      src={prod.thumbnail || "https://dummyjson.com/image/50x50"}
                      alt={prod.title}
                      className="rounded border object-fit-contain bg-light"
                      style={{ width: "45px", height: "45px" }}
                      onError={(e) => {
                        e.target.src = "https://dummyjson.com/image/50x50?text=Item";
                      }}
                    />
                  </td>
                  <td>
                    <span className="fw-semibold d-block text-truncate" style={{ maxWidth: "260px" }}>
                      {prod.title}
                    </span>
                    <small className="text-muted">{prod.brand || "Generic"}</small>
                  </td>
                  <td>
                    <Badge
                      bg={isDark ? "secondary" : "light"}
                      text={isDark ? "light" : "dark"}
                      className="border text-capitalize"
                    >
                      {prod.category?.replace(/-/g, " ")}
                    </Badge>
                  </td>
                  <td className="text-center fw-bold text-primary">${prod.price}</td>
                  <td className="text-center">
                    {prod.stock > 10 ? (
                      <span className="badge bg-success-subtle text-success">
                        {prod.stock} units
                      </span>
                    ) : prod.stock > 0 ? (
                      <span className="badge bg-warning-subtle text-warning-emphasis">
                        Low ({prod.stock})
                      </span>
                    ) : (
                      <span className="badge bg-danger-subtle text-danger">Out of stock</span>
                    )}
                  </td>
                  <td className="text-center">
                    <span className="d-flex align-items-center justify-content-center gap-1 small">
                      <FaStar className="text-warning" size={12} />
                      {prod.rating?.toFixed(1) || "4.5"}
                    </span>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="rounded-circle p-1"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => handleOpenEdit(prod)}
                        title="Edit product"
                      >
                        <FaEdit size={13} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="rounded-circle p-1"
                        style={{ width: "32px", height: "32px" }}
                        onClick={() => setDeleteId(prod.id)}
                        title="Delete product"
                      >
                        <FaTrash size={12} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="small text-muted">
            Showing page <strong>{currentPage + 1}</strong> of <strong>{totalPages}</strong> (
            {total} items)
          </span>
          <Pagination className="mb-0 shadow-sm rounded-pill overflow-hidden">
            <Pagination.Prev
              disabled={currentPage === 0}
              onClick={() => dispatch(setPage(currentPage - 1))}
            />
            <Pagination.Item active>{currentPage + 1}</Pagination.Item>
            <Pagination.Next
              disabled={currentPage >= totalPages - 1}
              onClick={() => dispatch(setPage(currentPage + 1))}
            />
          </Pagination>
        </div>
      )}

      {/* Product Form Modal (Add / Edit) */}
      <ProductForm
        key={`${showModal}-${editingProduct?.id ?? "new"}`}
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={Boolean(deleteId)} onHide={() => setDeleteId(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-danger">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this product? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)} className="rounded-pill px-3">
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} className="rounded-pill px-4 shadow">
            Delete Product
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
