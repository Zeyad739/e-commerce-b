import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Spinner,
  Breadcrumb,
  Card,
  Tab,
  Tabs,
} from "react-bootstrap";
import {
  fetchProductById,
  clearSelectedProduct,
} from "../store/Slices/productsSlice";
import { addToCart } from "../store/Slices/cartSlice";
import { useNotification } from "../utils/useNotification";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCartPlus,
  FaArrowLeft,
  FaCheckCircle,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaMinus,
  FaPlus,
  FaTag,
} from "react-icons/fa";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notify = useNotification();

  const { selectedProduct, detailsLoading, error } = useSelector(
    (state) => state.products
  );
  const isDark = useSelector((state) => state.theme.isDark);

  const [imageSelection, setImageSelection] = useState(null);
  const [quantitySelection, setQuantitySelection] = useState(null);
  const activeImage =
    imageSelection && imageSelection.productId === selectedProduct?.id
      ? imageSelection.image
      : selectedProduct?.thumbnail || selectedProduct?.images?.[0] || "";
  const quantity =
    quantitySelection && quantitySelection.productId === selectedProduct?.id
      ? quantitySelection.quantity
      : 1;

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  if (detailsLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" role="status" className="mb-3" />
        <p className="text-muted">Loading product details...</p>
      </Container>
    );
  }

  if (error || !selectedProduct) {
    return (
      <Container className="text-center py-5">
        <div className="alert alert-warning p-4 rounded-4 shadow-sm">
          <h4>Product Not Found</h4>
          <p className="text-muted">
            The product you are looking for might have been removed or is unavailable.
          </p>
          <Button as={Link} to="/products" variant="primary" className="rounded-pill px-4 mt-2">
            Back to Products
          </Button>
        </div>
      </Container>
    );
  }

  const {
    title,
    description,
    price,
    discountPercentage,
    rating = 4.5,
    stock = 10,
    brand,
    category,
    images = [],
    sku,
    weight,
    dimensions,
    warrantyInformation,
    shippingInformation,
    returnPolicy,
    reviews = [],
  } = selectedProduct;

  const originalPrice = discountPercentage
    ? (price / (1 - discountPercentage / 100)).toFixed(2)
    : null;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        ...selectedProduct,
        quantityToAdd: quantity,
      })
    );
    notify.success(
      `Added ${quantity} × "${title}" to your cart!`,
      "Product Added"
    );
  };

  const updateQuantity = (update) => {
    setQuantitySelection((currentSelection) => {
      const currentQuantity =
        currentSelection?.productId === selectedProduct.id
          ? currentSelection.quantity
          : 1;
      return {
        productId: selectedProduct.id,
        quantity: update(currentQuantity),
      };
    });
  };

  const renderStars = (score) => {
    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalf = score % 1 >= 0.4;
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-warning" size={16} />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<FaStarHalfAlt key={i} className="text-warning" size={16} />);
      } else {
        stars.push(<FaRegStar key={i} className="text-muted" size={16} />);
      }
    }
    return stars;
  };

  return (
    <Container className="py-4">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/products" }}>
          Products
        </Breadcrumb.Item>
        {category && (
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{ to: "/products" }}
            className="text-capitalize"
          >
            {category.replace(/-/g, " ")}
          </Breadcrumb.Item>
        )}
        <Breadcrumb.Item active className="text-truncate" style={{ maxWidth: "250px" }}>
          {title}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row className="g-5 mb-5">
        {/* Product Images Gallery */}
        <Col lg={6}>
          <div className="d-flex flex-column gap-3">
            {/* Main Featured Image */}
            <div
              className={`p-4 rounded-4 shadow-sm text-center d-flex align-items-center justify-content-center overflow-hidden position-relative border ${
                isDark ? "bg-dark border-secondary" : "bg-white border-light-subtle"
              }`}
              style={{ minHeight: "420px", maxHeight: "480px" }}
            >
              {discountPercentage && discountPercentage > 0 && (
                <Badge
                  bg="danger"
                  className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm"
                >
                  <FaTag className="me-1" />
                  Save {Math.round(discountPercentage)}%
                </Badge>
              )}
              <img
                src={activeImage || "https://dummyjson.com/image/500x400"}
                alt={title}
                className="img-fluid object-fit-contain"
                style={{ maxHeight: "380px", transition: "transform 0.3s ease" }}
                onError={(e) => {
                  e.target.src = "https://dummyjson.com/image/500x400?text=No+Image";
                }}
              />
            </div>

            {/* Thumbnail Carousel / Selector */}
            {images.length > 1 && (
              <div className="d-flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() =>
                      setImageSelection({ productId: selectedProduct.id, image: img })
                    }
                    className={`btn p-1 rounded-3 border bg-white ${
                      activeImage === img ? "border-primary border-2 shadow" : "border-muted"
                    }`}
                    style={{ width: "75px", height: "75px", flexShrink: 0 }}
                  >
                    <img
                      src={img}
                      alt={`${title} preview ${index + 1}`}
                      className="w-100 h-100 object-fit-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </Col>

        {/* Product Information */}
        <Col lg={6}>
          <div className="d-flex flex-column h-100">
            {/* Category & Brand */}
            <div className="d-flex align-items-center gap-2 mb-2">
              {brand && (
                <span className="badge bg-secondary-subtle text-secondary px-2 py-1 rounded-pill">
                  {brand}
                </span>
              )}
              {category && (
                <span className="badge bg-primary-subtle text-primary text-capitalize px-2 py-1 rounded-pill">
                  {category.replace(/-/g, " ")}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="fw-bold mb-3">{title}</h1>

            {/* Rating and Stock */}
            <div className="d-flex align-items-center gap-2 mb-3 pb-3 border-bottom">
              <div className="d-flex align-items-center gap-1">
                {renderStars(rating)}
              </div>
              <span className="fw-semibold">{rating.toFixed(1)}</span>
              <span className="text-muted small">
                ({reviews.length || 18} reviews)
              </span>
              <span className="mx-2 text-muted">|</span>
              {stock > 0 ? (
                <span className="text-success small fw-medium d-flex align-items-center gap-1">
                  <FaCheckCircle />
                  In Stock ({stock} available)
                </span>
              ) : (
                <span className="text-danger small fw-medium">Out of Stock</span>
              )}
            </div>

            {/* Price section */}
            <div className="d-flex align-items-baseline gap-3 mb-4">
              <span className="display-6 fw-bold text-primary">${price}</span>
              {originalPrice && (
                <span className="text-muted text-decoration-line-through fs-5">
                  ${originalPrice}
                </span>
              )}
              {discountPercentage && (
                <span className="text-danger fw-semibold small">
                  Save ${(originalPrice - price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-muted mb-4 lead fs-6">{description}</p>

            {/* Quantity Selector & Add to Cart */}
            <div className="d-flex flex-wrap align-items-center gap-3 mb-4 pb-4 border-bottom">
              <div
                className="d-flex align-items-center border rounded-pill p-1 shadow-sm"
                style={{ width: "140px" }}
              >
                <Button
                  variant="link"
                  className="text-dark p-0 flex-fill text-decoration-none"
                  disabled={quantity <= 1}
                  onClick={() => updateQuantity((q) => Math.max(1, q - 1))}
                >
                  <FaMinus size={12} />
                </Button>
                <span className="fw-bold px-2 flex-fill text-center">{quantity}</span>
                <Button
                  variant="link"
                  className="text-dark p-0 flex-fill text-decoration-none"
                  disabled={quantity >= stock}
                  onClick={() => updateQuantity((q) => Math.min(stock, q + 1))}
                >
                  <FaPlus size={12} />
                </Button>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={stock <= 0}
                className="flex-fill rounded-pill d-flex align-items-center justify-content-center gap-2 shadow"
              >
                <FaCartPlus />
                <span>Add to Cart</span>
              </Button>

              <Button
                as={Link}
                to="/cart"
                variant={isDark ? "outline-light" : "outline-secondary"}
                size="lg"
                className="rounded-pill px-4"
              >
                View Cart
              </Button>
            </div>

            {/* Value Guarantees */}
            <div className="row g-3 mt-auto">
              <div className="col-sm-4">
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <FaTruck className="text-primary fs-5" />
                  <div>
                    <strong className="d-block text-body">Shipping</strong>
                    {shippingInformation || "Free standard shipping"}
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <FaShieldAlt className="text-primary fs-5" />
                  <div>
                    <strong className="d-block text-body">Warranty</strong>
                    {warrantyInformation || "1 year manufacturer"}
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="d-flex align-items-center gap-2 text-muted small">
                  <FaUndo className="text-primary fs-5" />
                  <div>
                    <strong className="d-block text-body">Returns</strong>
                    {returnPolicy || "30 days easy returns"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Tabs: Specifications & Customer Reviews */}
      <Card
        className={`shadow-sm border-0 rounded-4 mb-4 ${
          isDark ? "bg-dark text-white border-secondary" : "bg-white"
        }`}
      >
        <Card.Body className="p-4">
          <Tabs defaultActiveKey="specs" className="mb-4">
            <Tab eventKey="specs" title="Product Specifications">
              <Row className="g-3">
                <Col md={6}>
                  <ul className="list-group list-group-flush rounded-3">
                    <li className="list-group-item d-flex justify-content-between bg-transparent">
                      <span className="text-muted">SKU:</span>
                      <span className="fw-medium">{sku || `SKU-${id}`}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between bg-transparent">
                      <span className="text-muted">Brand:</span>
                      <span className="fw-medium">{brand || "Generic"}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between bg-transparent">
                      <span className="text-muted">Category:</span>
                      <span className="fw-medium text-capitalize">
                        {category ? category.replace(/-/g, " ") : "General"}
                      </span>
                    </li>
                  </ul>
                </Col>
                <Col md={6}>
                  <ul className="list-group list-group-flush rounded-3">
                    <li className="list-group-item d-flex justify-content-between bg-transparent">
                      <span className="text-muted">Weight:</span>
                      <span className="fw-medium">{weight ? `${weight} kg` : "0.5 kg"}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between bg-transparent">
                      <span className="text-muted">Dimensions:</span>
                      <span className="fw-medium">
                        {dimensions
                          ? `${dimensions.width} × ${dimensions.height} × ${dimensions.depth} cm`
                          : "10 × 15 × 5 cm"}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between bg-transparent">
                      <span className="text-muted">Availability:</span>
                      <span className="fw-medium text-success">
                        {stock > 0 ? `${stock} units available` : "Out of stock"}
                      </span>
                    </li>
                  </ul>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="reviews" title={`Customer Reviews (${reviews.length})`}>
              {reviews.length === 0 ? (
                <p className="text-muted py-3">No reviews submitted yet.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {reviews.map((rev, idx) => (
                    <div
                      key={idx}
                      className="p-3 border rounded-3 bg-body-tertiary"
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <strong className="d-block">{rev.reviewerName}</strong>
                          <span className="small text-muted">{rev.reviewerEmail}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          {renderStars(rev.rating)}
                        </div>
                      </div>
                      <p className="mb-1 text-body">{rev.comment}</p>
                      <small className="text-muted">
                        {rev.date ? new Date(rev.date).toLocaleDateString() : "Recent"}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      <div className="mt-4">
        <Button
          onClick={() => navigate(-1)}
          variant={isDark ? "outline-light" : "outline-secondary"}
          className="rounded-pill px-4 d-inline-flex align-items-center gap-2"
        >
          <FaArrowLeft />
          Back
        </Button>
      </div>
    </Container>
  );
}
