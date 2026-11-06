import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/Slices/cartSlice";
import { useNotification } from "../utils/useNotification";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCartPlus,
  FaEye,
  FaTag,
} from "react-icons/fa";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const notify = useNotification();
  const isDark = useSelector((state) => state.theme.isDark);

  if (!product) return null;

  const {
    id,
    title,
    price,
    discountPercentage,
    thumbnail,
    category,
    rating = 4.5,
    stock = 10,
    description,
  } = product;

  // Calculate original price before discount
  const originalPrice = discountPercentage
    ? (price / (1 - discountPercentage / 100)).toFixed(2)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
    notify.success(`"${title}" added to your cart!`, "Added to Cart");
  };

  // Render star ratings
  const renderStars = (score) => {
    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalf = score % 1 >= 0.4;
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-warning" size={13} />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(<FaStarHalfAlt key={i} className="text-warning" size={13} />);
      } else {
        stars.push(<FaRegStar key={i} className="text-muted" size={13} />);
      }
    }
    return stars;
  };

  return (
    <Card
      className={`h-100 shadow-sm product-card border-0 rounded-4 overflow-hidden position-relative ${
        isDark ? "bg-dark text-white border-secondary" : "bg-white text-dark"
      }`}
      style={{
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {/* Discount Badge */}
      {discountPercentage && discountPercentage > 0 && (
        <Badge
          bg="danger"
          className="position-absolute top-0 start-0 m-3 px-2 py-1 rounded-pill z-2 shadow-sm"
        >
          <FaTag className="me-1" size={11} />
          -{Math.round(discountPercentage)}%
        </Badge>
      )}

      {/* Category Badge */}
      {category && (
        <Badge
          bg={isDark ? "secondary" : "light"}
          text={isDark ? "light" : "dark"}
          className="position-absolute top-0 end-0 m-3 px-2 py-1 rounded-pill z-2 shadow-sm text-capitalize border"
        >
          {category.replace(/-/g, " ")}
        </Badge>
      )}

      {/* Image container */}
      <Link
        to={`/products/${id}`}
        className="d-block overflow-hidden bg-body-tertiary position-relative text-center p-3"
        style={{ height: "220px" }}
      >
        <img
          src={thumbnail || "https://dummyjson.com/image/300x200"}
          alt={title}
          className="product-card-img w-100 h-100 object-fit-contain"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://dummyjson.com/image/300x200?text=No+Image";
          }}
        />
      </Link>

      <Card.Body className="d-flex flex-column p-3">
        {/* Rating */}
        <div className="d-flex align-items-center gap-1 mb-2">
          {renderStars(rating)}
          <span className="small text-muted ms-1">({rating.toFixed(1)})</span>
          {stock < 5 && stock > 0 && (
            <span className="badge bg-warning text-dark ms-auto small">
              Only {stock} left!
            </span>
          )}
        </div>

        {/* Title */}
        <Card.Title
          as={Link}
          to={`/products/${id}`}
          className={`text-decoration-none fw-bold fs-6 mb-1 text-truncate-2 ${
            isDark ? "text-white" : "text-dark"
          }`}
          title={title}
        >
          {title}
        </Card.Title>

        {/* Short Description */}
        <p className="text-muted small text-truncate-2 mb-3 flex-grow-1">
          {description}
        </p>

        {/* Pricing */}
        <div className="d-flex align-items-baseline gap-2 mb-3">
          <span className="fs-5 fw-bold text-primary">${price}</span>
          {originalPrice && (
            <span className="text-muted text-decoration-line-through small">
              ${originalPrice}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="d-grid gap-2 d-flex">
          <Button
            as={Link}
            to={`/products/${id}`}
            variant={isDark ? "outline-light" : "outline-secondary"}
            size="sm"
            className="flex-fill rounded-pill d-flex align-items-center justify-content-center gap-1"
          >
            <FaEye size={14} />
            <span>Details</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            className="flex-fill rounded-pill d-flex align-items-center justify-content-center gap-1 shadow-sm"
          >
            <FaCartPlus size={14} />
            <span>Add</span>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
