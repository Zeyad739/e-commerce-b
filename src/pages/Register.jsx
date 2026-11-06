import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
import { registerUser } from "../store/Slices/usersSlice";
import { useNotification } from "../utils/useNotification";
import {
  FaUserPlus,
  FaCheckCircle,
} from "react-icons/fa";

export default function Register() {
  const dispatch = useDispatch();
  const notify = useNotification();
  const isDark = useSelector((state) => state.theme.isDark);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successRegistered, setSuccessRegistered] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = "First name is required";
    if (!formData.username.trim()) errs.username = "Username is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Please provide a valid email address";
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters long";
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreeTerms) {
      errs.agreeTerms = "You must accept the terms and conditions";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await dispatch(
        registerUser({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          age: 25,
        })
      ).unwrap();

      setSuccessRegistered(true);
      notify.success(
        "Account created successfully! Please login with your credentials.",
        "Registration Complete"
      );
    } catch (error) {
      notify.error(
        typeof error === "string"
          ? error
          : error.message || "Registration failed. Please try again.",
        "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={9} lg={7} xl={6}>
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
                <FaUserPlus size={26} />
              </div>
              <h3 className="fw-bold mb-1">Create an Account</h3>
              <p className="mb-0 text-white-50 small">
                Join our community and start shopping today
              </p>
            </div>

            <Card.Body className="p-4 p-md-5">
              {successRegistered ? (
                <div className="text-center py-4">
                  <FaCheckCircle className="text-success display-3 mb-3" />
                  <h4 className="fw-bold mb-2">Registration Successful!</h4>
                  <p className="text-muted mb-4">
                    Your account <strong>{formData.username}</strong> has been registered.
                    You can now proceed to login.
                  </p>
                  <Button
                    as={Link}
                    to="/login"
                    variant="primary"
                    size="lg"
                    className="rounded-pill px-5 shadow"
                  >
                    Go to Login
                  </Button>
                </div>
              ) : (
                <Form onSubmit={handleRegister}>
                  <Row className="g-3 mb-3">
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">First Name *</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          isInvalid={Boolean(errors.firstName)}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                          className="rounded-3 shadow-none"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.firstName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                          }
                          className="rounded-3 shadow-none"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="g-3 mb-3">
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Username *</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="johndoe"
                          value={formData.username}
                          isInvalid={Boolean(errors.username)}
                          onChange={(e) =>
                            setFormData({ ...formData, username: e.target.value })
                          }
                          className="rounded-3 shadow-none"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          placeholder="+20 100 000 0000"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="rounded-3 shadow-none"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-semibold">Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      isInvalid={Boolean(errors.email)}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="rounded-3 shadow-none"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row className="g-3 mb-3">
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Password *</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Min 6 characters"
                          value={formData.password}
                          isInvalid={Boolean(errors.password)}
                          onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                          }
                          className="rounded-3 shadow-none"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col sm={6}>
                      <Form.Group>
                        <Form.Label className="small fw-semibold">Confirm Password *</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Repeat password"
                          value={formData.confirmPassword}
                          isInvalid={Boolean(errors.confirmPassword)}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="rounded-3 shadow-none"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Check
                      type="checkbox"
                      id="agreeTerms"
                      label="I agree to the Terms of Service & Privacy Policy"
                      checked={formData.agreeTerms}
                      isInvalid={Boolean(errors.agreeTerms)}
                      feedback={errors.agreeTerms}
                      feedbackType="invalid"
                      onChange={(e) =>
                        setFormData({ ...formData, agreeTerms: e.target.checked })
                      }
                      className="small text-muted"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="w-100 rounded-pill shadow mb-4 d-flex align-items-center justify-content-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <FaUserPlus />
                        <span>Create Account</span>
                      </>
                    )}
                  </Button>

                  <div className="text-center small text-muted">
                    Already have an account?{" "}
                    <Link to="/login" className="fw-semibold text-primary text-decoration-none">
                      Sign In
                    </Link>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
