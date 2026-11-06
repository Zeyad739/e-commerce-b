import { Container, Row, Col, Nav, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AiOutlineShop,
} from "react-icons/ai";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaHeart,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  const isDark = useSelector((state) => state.theme.isDark);
  const currentUser = useSelector((state) => state.users.currentUser);
  const isAdmin = currentUser?.role === "admin" || currentUser?.username === "emilys";

  return (
    <footer
      className={`border-top mt-auto py-5 ${
        isDark ? "bg-dark text-white border-secondary" : "bg-light text-dark"
      }`}
    >
      <Container>
        <Row className="g-4 mb-5">
          {/* Brand & About */}
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="rounded-3 bg-primary text-white p-2 d-flex align-items-center justify-content-center shadow-sm"
                style={{ width: "36px", height: "36px" }}
              >
                <AiOutlineShop size={20} />
              </div>
              <span className="fw-bold fs-4 text-primary">E-Commerce</span>
            </div>
            <p className="text-muted small mb-4 pe-lg-3">
              Your one-stop destination for quality lifestyle products, top electronics,
              beauty collections, and fast global shipping. Built with React, Redux Toolkit,
              and DummyJSON.
            </p>
            <div className="d-flex gap-3 text-muted">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-reset">
                <FaGithub size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-reset">
                <FaLinkedin size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-reset">
                <FaTwitter size={18} />
              </a>
            </div>
          </Col>

          {/* Quick Links */}
          <Col lg={2} md={6} xs={6}>
            <h6 className="fw-bold mb-3 small text-uppercase">Quick Links</h6>
            <Nav className="flex-column gap-2 small">
              <Nav.Link as={Link} to="/" className="p-0 text-muted">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/products" className="p-0 text-muted">
                Catalog & Products
              </Nav.Link>
              <Nav.Link as={Link} to="/cart" className="p-0 text-muted">
                Shopping Cart
              </Nav.Link>
              {isAdmin && (
                <Nav.Link as={Link} to="/dashboard" className="p-0 text-muted">
                  Admin Dashboard
                </Nav.Link>
              )}
            </Nav>
          </Col>

          {/* Customer Area */}
          <Col lg={2} md={6} xs={6}>
            <h6 className="fw-bold mb-3 small text-uppercase">Account</h6>
            <Nav className="flex-column gap-2 small">
              <Nav.Link as={Link} to="/profile" className="p-0 text-muted">
                User Profile
              </Nav.Link>
              <Nav.Link as={Link} to="/login" className="p-0 text-muted">
                Sign In
              </Nav.Link>
              <Nav.Link as={Link} to="/register" className="p-0 text-muted">
                Create Account
              </Nav.Link>
            </Nav>
          </Col>

          {/* Contact Details */}
          <Col lg={4} md={6}>
            <h6 className="fw-bold mb-3 small text-uppercase">Contact & Support</h6>
            <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-4">
              <li className="d-flex align-items-center gap-2">
                <FaEnvelope className="text-primary" />
                <span>support@ecommerce.com</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaPhoneAlt className="text-primary" />
                <span>+20 152 453 4214</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <FaMapMarkerAlt className="text-primary" />
                <span>Cairo, Egypt</span>
              </li>
            </ul>

            <h6 className="fw-bold mb-2 small text-uppercase">Stay in the Loop</h6>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for subscribing to our newsletter!");
              }}
            >
              <div className="d-flex gap-2">
                <Form.Control
                  type="email"
                  placeholder="Enter email..."
                  size="sm"
                  required
                  className="rounded-pill shadow-none"
                />
                <Button type="submit" variant="primary" size="sm" className="rounded-pill px-3">
                  Join
                </Button>
              </div>
            </Form>
          </Col>
        </Row>

        <div className="border-top pt-4 text-center text-muted small d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <span>
            © {new Date().getFullYear()} E-Commerce Platform. All rights reserved.
          </span>
          <span className="d-flex align-items-center gap-1">
            Built with <FaHeart className="text-danger" size={12} /> using React & Bootstrap
          </span>
        </div>
      </Container>
    </footer>
  );
}
