import {
  Button,
  Container,
  Nav,
  Navbar,
  Badge,
  NavDropdown,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../store/Slices/themeSlice";
import { logout } from "../store/Slices/usersSlice";
import { useNotification } from "../utils/useNotification";
import {
  AiOutlineShop,
} from "react-icons/ai";
import {
  MdDarkMode,
  MdLightMode,
} from "react-icons/md";
import {
  FaShoppingCart,
  FaUserCircle,
  FaTachometerAlt,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

export default function GlobalNavbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = useNotification();

  const isDark = useSelector((state) => state.theme.isDark);
  const { totalQuantity } = useSelector((state) => state.cart);
  const { currentUser, isAuthenticated } = useSelector((state) => state.users);

  const isAdmin = currentUser?.role === "admin" || currentUser?.username === "emilys";

  const handleLogout = () => {
    dispatch(logout());
    notify.info("Signed out successfully.", "Logout");
    navigate("/login");
  };

  return (
    <Navbar
      expand="lg"
      sticky="top"
      bg={isDark ? "dark" : "white"}
      data-bs-theme={isDark ? "dark" : "light"}
      className="shadow-sm py-2 border-bottom"
    >
      <Container>
        {/* Brand */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2 fw-bold fs-4 text-primary"
        >
          <div
            className="rounded-3 bg-primary text-white p-2 d-flex align-items-center justify-content-center shadow-sm"
            style={{ width: "38px", height: "38px" }}
          >
            <AiOutlineShop size={22} />
          </div>
          <span>E-Commerce</span>
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle aria-controls="main-navbar-nav" />

        {/* Collapsible Nav Links */}
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="mx-auto gap-1">
            <Nav.Link as={Link} to="/" className="fw-medium px-3">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/products" className="fw-medium px-3">
              Products
            </Nav.Link>
            {isAdmin && (
              <Nav.Link as={Link} to="/dashboard" className="fw-medium px-3 d-flex align-items-center gap-1">
                <span>Dashboard</span>
                <Badge bg="danger" className="small" style={{ fontSize: "10px" }}>
                  Admin
                </Badge>
              </Nav.Link>
            )}
          </Nav>

          {/* Right Action Icons & Controls */}
          <Nav className="align-items-lg-center gap-2 mt-3 mt-lg-0">
            {/* Theme Toggle Button */}
            <Button
              variant={isDark ? "outline-light" : "outline-secondary"}
              size="sm"
              onClick={() => dispatch(toggle())}
              className="rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm border-0"
              style={{ width: "38px", height: "38px" }}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <MdLightMode size={20} className="text-warning" />
              ) : (
                <MdDarkMode size={20} className="text-dark" />
              )}
            </Button>

            {/* Cart Icon with badge */}
            <Button
              as={Link}
              to="/cart"
              variant={isDark ? "outline-light" : "outline-primary"}
              size="sm"
              className="rounded-pill px-3 py-2 position-relative d-flex align-items-center gap-2 shadow-sm"
            >
              <FaShoppingCart size={16} />
              <span className="fw-semibold">Cart</span>
              {totalQuantity > 0 && (
                <Badge
                  pill
                  bg="danger"
                  className="position-absolute top-0 start-100 translate-middle shadow-sm"
                >
                  {totalQuantity}
                </Badge>
              )}
            </Button>

            {/* User Profile or Login/Register */}
            {isAuthenticated && currentUser ? (
              <NavDropdown
                title={
                  <span className="d-inline-flex align-items-center gap-2">
                    <img
                      src={
                        currentUser.image ||
                        `https://dummyjson.com/icon/${currentUser.username || "user"}/128`
                      }
                      alt={currentUser.firstName}
                      className="rounded-circle border"
                      style={{ width: "28px", height: "28px", objectFit: "cover" }}
                    />
                    <span className="fw-semibold small">
                      {currentUser.firstName || currentUser.username}
                    </span>
                  </span>
                }
                id="user-nav-dropdown"
                align="end"
                className="user-dropdown"
              >
                <NavDropdown.Header>
                  <strong className="d-block">{currentUser.firstName} {currentUser.lastName}</strong>
                  <small className="text-muted">@{currentUser.username}</small>
                </NavDropdown.Header>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/profile" className="d-flex align-items-center gap-2">
                  <FaUserCircle className="text-primary" />
                  <span>My Profile</span>
                </NavDropdown.Item>
                {isAdmin && (
                  <NavDropdown.Item as={Link} to="/dashboard" className="d-flex align-items-center gap-2">
                    <FaTachometerAlt className="text-success" />
                    <span>Admin Dashboard</span>
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="d-flex align-items-center gap-2 text-danger"
                >
                  <FaSignOutAlt />
                  <span>Sign Out</span>
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-primary"
                  size="sm"
                  className="rounded-pill px-3 d-flex align-items-center gap-1 shadow-sm"
                >
                  <FaSignInAlt size={13} />
                  <span>Login</span>
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="primary"
                  size="sm"
                  className="rounded-pill px-3 d-flex align-items-center gap-1 shadow-sm"
                >
                  <FaUserPlus size={13} />
                  <span>Register</span>
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
