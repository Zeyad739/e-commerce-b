import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Carousel,
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Spinner,
} from "react-bootstrap";
import heroimage1 from "../assets/Image 1.webp";
import heroimage2 from "../assets/Image 2.webp";
import heroimage3 from "../assets/Image 3.webp";
import ProductCard from "../components/ProductCard";
import CategoryList from "../components/CategoryList";
import { fetchProducts } from "../store/Slices/productsSlice";
import {
  FaShippingFast,
  FaHeadset,
  FaShieldAlt,
  FaUndoAlt,
  FaArrowRight,
  FaFire,
  FaTags,
} from "react-icons/fa";

export default function Home() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);
  const isDark = useSelector((state) => state.theme.isDark);

  useEffect(() => {
    if (!items || items.length === 0) {
      dispatch(fetchProducts({ limit: 8, skip: 0 }));
    }
  }, [dispatch, items]);

  const HeroSlides = [
    {
      image: heroimage1,
      title: "Elevate Your Lifestyle",
      subtitle: "Discover New Arrivals & Modern Essentials",
      discount: "UP TO 40% OFF",
      cta: "Shop The Collection",
      link: "/products",
    },
    {
      image: heroimage2,
      title: "Premium Tech & Gadgets",
      subtitle: "Cutting-edge electronics and accessories at unbeatable value",
      discount: "HOT DEALS",
      cta: "Explore Tech",
      link: "/products",
    },
    {
      image: heroimage3,
      title: "Exclusive Beauty & Fashion",
      subtitle: "Curated selections crafted to inspire your unique daily style",
      discount: "LIMITED TIME",
      cta: "Browse Beauty",
      link: "/products",
    },
  ];

  const features = [
    {
      icon: <FaShippingFast size={26} className="text-primary" />,
      title: "Free Express Shipping",
      desc: "On all orders over $100 worldwide",
    },
    {
      icon: <FaShieldAlt size={26} className="text-success" />,
      title: "Secure Payment",
      desc: "100% encrypted & protected checkouts",
    },
    {
      icon: <FaUndoAlt size={26} className="text-warning" />,
      title: "30-Day Easy Returns",
      desc: "Hassle-free guarantee on all purchases",
    },
    {
      icon: <FaHeadset size={26} className="text-info" />,
      title: "24/7 Dedicated Support",
      desc: "Friendly assistance anytime you need",
    },
  ];

  return (
    <div className="home-page pb-5">
      {/* Hero Carousel */}
      <div className="hero-carousel-wrapper position-relative overflow-hidden mb-5">
        <Carousel fade interval={5000} className="shadow-sm">
          {HeroSlides.map((slide, index) => (
            <Carousel.Item key={index}>
              <div
                className="hero-slide-img position-relative"
                style={{
                  height: "520px",
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.6)), url("${slide.image}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="h-100 d-flex align-items-center">
                  <Container>
                    <div
                      className="p-4 p-md-5 rounded-4 text-white"
                      style={{
                        maxWidth: "640px",
                        background: "rgba(15, 23, 42, 0.65)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      <Badge bg="danger" className="px-3 py-2 rounded-pill mb-3 fw-bold">
                        <FaTags className="me-1" />
                        {slide.discount}
                      </Badge>
                      <h1 className="display-5 fw-bold mb-3">{slide.title}</h1>
                      <p className="lead text-light mb-4 fs-6">{slide.subtitle}</p>
                      <Button
                        as={Link}
                        to={slide.link}
                        variant="primary"
                        size="lg"
                        className="rounded-pill px-4 py-2 shadow fw-semibold d-inline-flex align-items-center gap-2"
                      >
                        <span>{slide.cta}</span>
                        <FaArrowRight size={14} />
                      </Button>
                    </div>
                  </Container>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <Container>
        {/* Value Propositions / Features Grid */}
        <Row className="g-3 mb-5">
          {features.map((feat, idx) => (
            <Col key={idx} xs={12} sm={6} lg={3}>
              <Card
                className={`h-100 border-0 shadow-sm rounded-4 p-3 ${
                  isDark ? "bg-dark text-white border-secondary" : "bg-white"
                }`}
              >
                <Card.Body className="d-flex align-items-center gap-3 p-2">
                  <div className="p-3 rounded-circle bg-body-tertiary shadow-sm flex-shrink-0">
                    {feat.icon}
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1 fs-6">{feat.title}</h6>
                    <small className="text-muted">{feat.desc}</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Categories Bar */}
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className="fw-bold fs-3 mb-0">Shop by Category</h2>
              <small className="text-muted">Explore items from our diverse catalog</small>
            </div>
            <Button
              as={Link}
              to="/products"
              variant="outline-primary"
              size="sm"
              className="rounded-pill px-3"
            >
              View All
            </Button>
          </div>
          <CategoryList />
        </div>

        {/* Trending & Featured Products */}
        <div className="mb-5">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <FaFire className="text-danger fs-4" />
                <h2 className="fw-bold fs-3 mb-0">Trending Products</h2>
              </div>
              <small className="text-muted">Top rated picks loved by our customers</small>
            </div>
            <Button
              as={Link}
              to="/products"
              variant="primary"
              className="rounded-pill px-4 shadow-sm"
            >
              See All Products
            </Button>
          </div>

          {loading && items.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="text-muted mt-2">Loading featured items...</p>
            </div>
          ) : (
            <Row className="g-4">
              {items.slice(0, 8).map((product) => (
                <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </div>

        {/* Promotional Callout Banner */}
        <div
          className="rounded-4 p-4 p-md-5 text-white my-5 text-center position-relative overflow-hidden shadow-lg"
          style={{
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          }}
        >
          <div className="position-relative z-1" style={{ maxWidth: "700px", margin: "0 auto" }}>
            <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill fw-bold mb-3">
              SPECIAL PROMO CODE: SAVE10
            </Badge>
            <h2 className="display-6 fw-bold mb-3">
              Upgrade Your Everyday Experience
            </h2>
            <p className="lead text-white-50 fs-6 mb-4">
              Apply coupon <strong>SAVE10</strong> at checkout to get an extra 10% discount on
              all orders! Limited time only.
            </p>
            <Button
              as={Link}
              to="/products"
              variant="light"
              size="lg"
              className="rounded-pill px-5 shadow fw-semibold text-primary"
            >
              Start Shopping Now
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
