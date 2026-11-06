import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { loginUser, clearAuthError } from "../store/Slices/usersSlice";
import { useNotification } from "../utils/useNotification";
import {
  FaSignInAlt,
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShoppingBag,
  FaKey,
} from "react-icons/fa";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotification();

  const { loading, authError } = useSelector((state) => state.users);
  const isDark = useSelector((state) => state.theme.isDark);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const from = location.state?.from?.pathname || "/profile";

  const handleLogin = async (e) => {
    e.preventDefault();
    setValidationError("");
    dispatch(clearAuthError());

    if (!username.trim()) {
      setValidationError("Please enter your username or email.");
      return;
    }
    if (!password.trim()) {
      setValidationError("Please enter your password.");
      return;
    }

    const result = await dispatch(loginUser({ username, password }));
    if (loginUser.fulfilled.match(result)) {
      notify.success(
        `Welcome back, ${result.payload.firstName || result.payload.username}!`,
        "Login Successful"
      );
      navigate(from, { replace: true });
    }
  };

  // Demo user quick login handler
  const setDemoUser = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setValidationError("");
    dispatch(clearAuthError());
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={5}>
          <Card
            className={`border-0 shadow-lg rounded-4 overflow-hidden ${
              isDark ? "bg-dark text-white border-secondary" : "bg-white"
            }`}
          >
            {/* Header */}
            <div className="bg-primary p-4 text-white text-center">
              <div
                className="bg-white bg-opacity-25 rounded-circle d-inline-flex p-3 mb-2"
                style={{ width: "60px", height: "60px", alignItems: "center", justifyContent: "center" }}
              >
                <FaShoppingBag size={28} />
              </div>
              <h3 className="fw-bold mb-1">Welcome Back</h3>
              <p className="mb-0 text-white-50 small">
                Sign in to manage your account and orders
              </p>
            </div>

            <Card.Body className="p-4 p-md-5">
              {/* Errors */}
              {(validationError || authError) && (
                <Alert variant="danger" className="rounded-3 small py-2 mb-4">
                  {validationError || authError}
                </Alert>
              )}

              {/* Login Form */}
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold">Username or Email</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="text"
                      placeholder="e.g. emilys"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="ps-5 py-2 shadow-none rounded-3"
                    />
                    <FaUser
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                      size={14}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="small fw-semibold">Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="ps-5 pe-5 py-2 shadow-none rounded-3"
                    />
                    <FaLock
                      className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"
                      size={14}
                    />
                    <button
                      type="button"
                      className="btn position-absolute top-50 end-0 translate-middle-y me-2 p-1 text-muted border-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="w-100 rounded-pill shadow mb-3 d-flex align-items-center justify-content-center gap-2"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <FaSignInAlt />
                      <span>Sign In</span>
                    </>
                  )}
                </Button>
              </Form>

              {/* Demo Credentials Helper */}
              <div className="p-3 rounded-3 bg-body-tertiary mb-4 border">
                <span className="d-flex align-items-center gap-1 small fw-semibold text-muted mb-2">
                  <FaKey className="text-warning" />
                  <span>Click for Instant Demo Login:</span>
                </span>
                <div className="d-flex flex-wrap gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="rounded-pill small py-1"
                    onClick={() => setDemoUser("emilys", "emilyspass")}
                  >
                    Emily Johnson (Admin)
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="rounded-pill small py-1"
                    onClick={() => setDemoUser("averyp", "averyppass")}
                  >
                    Avery Perez (Customer)
                  </Button>
                </div>
              </div>

              {/* Footer link */}
              <div className="text-center small text-muted">
                Don't have an account yet?{" "}
                <Link to="/register" className="fw-semibold text-primary text-decoration-none">
                  Create an Account
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
