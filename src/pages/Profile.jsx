import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Tab,
  Nav,
  Spinner,
} from "react-bootstrap";
import { logout, fetchAuthUser } from "../store/Slices/usersSlice";
import { fetchUserCarts } from "../store/Slices/cartSlice";
import { useNotification } from "../utils/useNotification";
import {
  FaEnvelope,
  FaPhone,
  FaSignOutAlt,
  FaTachometerAlt,
  FaShoppingBag,
  FaIdBadge,
} from "react-icons/fa";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = useNotification();

  const { currentUser, token } = useSelector((state) => state.users);
  const { userCarts, loading: cartsLoading } = useSelector((state) => state.cart);
  const isDark = useSelector((state) => state.theme.isDark);

  useEffect(() => {
    if (token) {
      dispatch(fetchAuthUser());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchUserCarts(currentUser.id));
    }
  }, [dispatch, currentUser?.id]);

  const handleLogout = () => {
    dispatch(logout());
    notify.info("You have been signed out successfully.", "Signed Out");
    navigate("/login");
  };

  if (!currentUser) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="text-muted mt-2">Loading user profile...</p>
      </Container>
    );
  }

  const {
    firstName,
    lastName,
    username,
    email,
    phone,
    gender,
    age,
    image,
    role,
    company,
    address,
  } = currentUser;

  return (
    <Container className="py-5">
      {/* Profile Overview Header Card */}
      <Card
        className={`border-0 shadow-sm rounded-4 overflow-hidden mb-4 ${
          isDark ? "bg-dark text-white border-secondary" : "bg-white"
        }`}
      >
        <div
          className="p-4 p-md-5 text-white"
          style={{
            background: "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)",
          }}
        >
          <div className="d-flex flex-column flex-md-row align-items-center gap-4">
            <img
              src={
                image ||
                `https://dummyjson.com/icon/${username || "user"}/128`
              }
              alt={firstName}
              className="rounded-circle border border-4 border-white shadow bg-white p-1"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src = "https://dummyjson.com/image/128x128?text=User";
              }}
            />
            <div className="text-center text-md-start">
              <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
                <h2 className="fw-bold mb-0">
                  {firstName} {lastName}
                </h2>
                <Badge bg="light" text="dark" className="rounded-pill text-capitalize">
                  {role || "Customer"}
                </Badge>
              </div>
              <p className="mb-2 text-white-50">@{username}</p>
              <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 small text-white-50">
                <span>
                  <FaEnvelope className="me-1" />
                  {email}
                </span>
                <span>
                  <FaPhone className="me-1" />
                  {phone || "+1 (555) 000-0000"}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="ms-md-auto d-flex flex-wrap gap-2 mt-3 mt-md-0">
              {(role === "admin" || username === "emilys") && (
                <Button
                  as={Link}
                  to="/dashboard"
                  variant="light"
                  className="rounded-pill px-4 shadow-sm fw-semibold d-flex align-items-center gap-2"
                >
                  <FaTachometerAlt />
                  <span>Admin Dashboard</span>
                </Button>
              )}
              <Button
                variant="outline-light"
                onClick={handleLogout}
                className="rounded-pill px-4 d-flex align-items-center gap-2"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Details & Orders Tabs */}
      <Tab.Container defaultActiveKey="details">
        <Card
          className={`border-0 shadow-sm rounded-4 overflow-hidden ${
            isDark ? "bg-dark text-white border-secondary" : "bg-white"
          }`}
        >
          <div className="border-bottom px-4 pt-3">
            <Nav variant="underline" className="gap-4">
              <Nav.Item>
                <Nav.Link eventKey="details" className="fw-bold pb-3">
                  <FaIdBadge className="me-2" />
                  Personal Information
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="orders" className="fw-bold pb-3">
                  <FaShoppingBag className="me-2" />
                  My Orders & Carts ({userCarts?.length || 0})
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          <Card.Body className="p-4">
            <Tab.Content>
              {/* Personal Information Tab */}
              <Tab.Pane eventKey="details">
                <Row className="g-4">
                  <Col md={6}>
                    <h6 className="fw-bold text-muted text-uppercase small mb-3">
                      Basic Profile
                    </h6>
                    <ul className="list-group list-group-flush rounded-3">
                      <li className="list-group-item d-flex justify-content-between bg-transparent">
                        <span className="text-muted">Full Name:</span>
                        <strong className="text-body">
                          {firstName} {lastName}
                        </strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between bg-transparent">
                        <span className="text-muted">Username:</span>
                        <strong className="text-body">@{username}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between bg-transparent">
                        <span className="text-muted">Email Address:</span>
                        <strong className="text-body">{email}</strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between bg-transparent">
                        <span className="text-muted">Gender & Age:</span>
                        <strong className="text-body text-capitalize">
                          {gender || "N/A"}, {age || "26"} yrs
                        </strong>
                      </li>
                    </ul>
                  </Col>

                  <Col md={6}>
                    <h6 className="fw-bold text-muted text-uppercase small mb-3">
                      Work & Address
                    </h6>
                    <ul className="list-group list-group-flush rounded-3">
                      <li className="list-group-item d-flex justify-content-between bg-transparent">
                        <span className="text-muted">Company:</span>
                        <strong className="text-body">
                          {company?.name || "Self Employed"}
                        </strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between bg-transparent">
                        <span className="text-muted">Department / Title:</span>
                        <strong className="text-body">
                          {company?.title || "Specialist"}
                        </strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between bg-transparent">
                        <span className="text-muted">City & State:</span>
                        <strong className="text-body">
                          {address?.city || "Cairo"}, {address?.state || "Capital"}
                        </strong>
                      </li>
                      <li className="list-group-item d-flex justify-content-between bg-transparent">
                        <span className="text-muted">Street Address:</span>
                        <strong className="text-body">
                          {address?.address || "Main Street 101"}
                        </strong>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* User Orders / Carts Tab */}
              <Tab.Pane eventKey="orders">
                {cartsLoading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" variant="primary" />
                    <p className="text-muted mt-2">Loading user carts...</p>
                  </div>
                ) : userCarts && userCarts.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {userCarts.map((c) => (
                      <Card
                        key={c.id}
                        className={`border rounded-4 p-3 ${
                          isDark ? "bg-dark border-secondary" : "bg-body-tertiary"
                        }`}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                          <div>
                            <strong className="fs-6">Order #{c.id}</strong>
                            <span className="text-muted small ms-2">
                              • {c.totalProducts} unique items ({c.totalQuantity} units)
                            </span>
                          </div>
                          <span className="text-success fw-bold fs-6">
                            Total: ${c.discountedTotal || c.total}
                          </span>
                        </div>

                        <div className="d-flex flex-wrap gap-2">
                          {c.products?.map((p) => (
                            <div
                              key={p.id}
                              className="d-flex align-items-center gap-2 border rounded-pill px-3 py-1 bg-body small"
                            >
                              <img
                                src={p.thumbnail}
                                alt={p.title}
                                className="rounded-circle"
                                style={{ width: "24px", height: "24px", objectFit: "cover" }}
                              />
                              <span className="text-truncate" style={{ maxWidth: "160px" }}>
                                {p.title}
                              </span>
                              <strong className="text-primary">×{p.quantity}</strong>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <p>No previous orders found for this user account.</p>
                    <Button as={Link} to="/products" variant="primary" className="rounded-pill px-4">
                      Start Shopping
                    </Button>
                  </div>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Card>
      </Tab.Container>
    </Container>
  );
}
