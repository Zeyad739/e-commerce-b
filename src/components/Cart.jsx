import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  InputGroup,
  Badge,
  Modal,
  ProgressBar,
  Tab,
  Tabs,
  Spinner,
} from "react-bootstrap";
import {
  removeFromCart,
  updateQuantity,
  decrementQuantity,
  clearCart,
  applyPromoCode,
  fetchApiCarts,
} from "../store/Slices/cartSlice";
import { useNotification } from "../utils/useNotification";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaShoppingBag,
  FaCheck,
  FaTruck,
  FaLock,
  FaReceipt,
  FaCreditCard,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function Cart() {
  const dispatch = useDispatch();
  const notify = useNotification();

  const {
    items,
    totalQuantity,
    totalAmount,
    discountPercent,
    discountAmount,
    finalAmount,
    promoCode,
    apiCarts,
    loading: apiLoading,
  } = useSelector((state) => state.cart);
  const isDark = useSelector((state) => state.theme.isDark);
  const currentUser = useSelector((state) => state.users.currentUser);

  const [inputCoupon, setInputCoupon] = useState("");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: currentUser ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}` : "",
    address: "123 Market Street",
    city: "Cairo",
    phone: currentUser?.phone || "+20 100 000 0000",
    paymentMethod: "cod",
  });

  // Calculate free shipping progress ($100 target)
  const freeShippingThreshold = 100;
  const freeShippingProgress = Math.min(100, Math.round((totalAmount / freeShippingThreshold) * 100));
  const freeShippingRemaining = (freeShippingThreshold - totalAmount).toFixed(2);
  const shippingCost = totalAmount >= freeShippingThreshold || totalAmount === 0 ? 0 : 9.99;
  const grandTotal = Number((finalAmount + shippingCost).toFixed(2));

  // Load API carts on demand
  useEffect(() => {
    dispatch(fetchApiCarts());
  }, [dispatch]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    dispatch(applyPromoCode(inputCoupon));
    const upper = inputCoupon.toUpperCase().trim();
    if (upper === "SAVE10" || upper === "WELCOME10") {
      notify.success("10% Discount applied successfully!", "Coupon Applied");
    } else if (upper === "SAVE20" || upper === "SUPER20") {
      notify.success("20% Discount applied successfully!", "Coupon Applied");
    } else if (upper === "HALF50") {
      notify.success("50% Super Discount applied!", "Coupon Applied");
    } else {
      notify.warning("Invalid promo code. Try SAVE10 or SAVE20", "Promo Code");
    }
    setInputCoupon("");
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setShowCheckoutModal(false);
    setOrderNumber(Math.floor(100000 + Math.random() * 900000));
    setShowSuccessModal(true);
    dispatch(clearCart());
    notify.success("Your order was placed successfully!", "Order Confirmed");
  };

  return (
    <Container className="py-4">
      {/* Page Title */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fw-bold fs-2 mb-1">Shopping Cart</h1>
          <p className="text-muted small mb-0">
            Review your selected items and proceed to secure checkout
          </p>
        </div>
        {items.length > 0 && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your cart?")) {
                dispatch(clearCart());
                notify.info("Cart cleared");
              }
            }}
            className="rounded-pill px-3"
          >
            <FaTrash className="me-1" />
            Clear Cart
          </Button>
        )}
      </div>

      <Tabs defaultActiveKey="my-cart" className="mb-4">
        {/* Active Shopping Cart Tab */}
        <Tab
          eventKey="my-cart"
          title={
            <span>
              <FaShoppingBag className="me-1" />
              My Cart ({totalQuantity})
            </span>
          }
        >
          {items.length === 0 ? (
            <div className="text-center py-5 my-4">
              <div className="display-4 text-muted mb-3">🛒</div>
              <h3 className="fw-bold">Your Cart is Currently Empty</h3>
              <p className="text-muted mb-4">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Button
                as={Link}
                to="/products"
                variant="primary"
                size="lg"
                className="rounded-pill px-5 shadow"
              >
                Browse Products
              </Button>
            </div>
          ) : (
            <Row className="g-4">
              {/* Cart Items List */}
              <Col lg={8}>
                {/* Free Shipping Banner */}
                <Card
                  className={`mb-3 border-0 shadow-sm rounded-4 p-3 ${
                    isDark ? "bg-dark text-white border-secondary" : "bg-white"
                  }`}
                >
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="small fw-semibold d-flex align-items-center gap-2">
                      <FaTruck className="text-primary" />
                      {totalAmount >= freeShippingThreshold ? (
                        <span className="text-success fw-bold">
                          🎉 You unlocked FREE Shipping!
                        </span>
                      ) : (
                        <span>
                          Add <strong>${freeShippingRemaining}</strong> more for FREE
                          Shipping!
                        </span>
                      )}
                    </span>
                    <span className="small text-muted">{freeShippingProgress}%</span>
                  </div>
                  <ProgressBar
                    now={freeShippingProgress}
                    variant={freeShippingProgress >= 100 ? "success" : "primary"}
                    style={{ height: "6px" }}
                    className="rounded-pill"
                  />
                </Card>

                {/* Items Table / Cards */}
                <Card
                  className={`border-0 shadow-sm rounded-4 overflow-hidden ${
                    isDark ? "bg-dark text-white border-secondary" : "bg-white"
                  }`}
                >
                  <Table responsive hover className="mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-end">Subtotal</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <img
                                src={item.thumbnail || "https://dummyjson.com/image/100x100"}
                                alt={item.title}
                                className="rounded-3 border object-fit-contain bg-light"
                                style={{ width: "65px", height: "65px" }}
                              />
                              <div>
                                <Link
                                  to={`/products/${item.id}`}
                                  className={`fw-semibold text-decoration-none d-block ${
                                    isDark ? "text-white" : "text-dark"
                                  }`}
                                >
                                  {item.title}
                                </Link>
                                <small className="text-muted text-capitalize">
                                  {item.category?.replace(/-/g, " ")}
                                </small>
                              </div>
                            </div>
                          </td>

                          <td className="text-center fw-semibold text-primary">
                            ${item.price}
                          </td>

                          <td className="text-center">
                            <div
                              className="d-inline-flex align-items-center border rounded-pill p-1 shadow-sm"
                              style={{ width: "115px" }}
                            >
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 text-dark flex-fill text-decoration-none"
                                onClick={() => dispatch(decrementQuantity(item.id))}
                              >
                                <FaMinus size={10} />
                              </Button>
                              <span className="fw-bold px-2 flex-fill text-center small">
                                {item.quantity}
                              </span>
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 text-dark flex-fill text-decoration-none"
                                disabled={item.quantity >= (item.stock || 99)}
                                onClick={() =>
                                  dispatch(
                                    updateQuantity({
                                      id: item.id,
                                      quantity: item.quantity + 1,
                                    })
                                  )
                                }
                              >
                                <FaPlus size={10} />
                              </Button>
                            </div>
                          </td>

                          <td className="text-end fw-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>

                          <td className="text-center">
                            <Button
                              variant="link"
                              className="text-danger p-0"
                              onClick={() => {
                                dispatch(removeFromCart(item.id));
                                notify.info(`Removed "${item.title}"`);
                              }}
                              title="Remove item"
                            >
                              <FaTrash size={14} />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>

                <div className="mt-3">
                  <Button
                    as={Link}
                    to="/products"
                    variant={isDark ? "outline-light" : "outline-secondary"}
                    className="rounded-pill px-4 d-inline-flex align-items-center gap-2"
                  >
                    <FaArrowLeft />
                    Continue Shopping
                  </Button>
                </div>
              </Col>

              {/* Order Summary */}
              <Col lg={4}>
                <Card
                  className={`border-0 shadow-sm rounded-4 p-4 sticky-top ${
                    isDark ? "bg-dark text-white border-secondary" : "bg-white"
                  }`}
                  style={{ top: "90px" }}
                >
                  <h4 className="fw-bold mb-4">Order Summary</h4>

                  {/* Pricing Breakdown */}
                  <div className="d-flex flex-column gap-3 mb-4">
                    <div className="d-flex justify-content-between text-muted">
                      <span>Items Subtotal ({totalQuantity})</span>
                      <span className="fw-semibold text-body">${totalAmount}</span>
                    </div>

                    {discountPercent > 0 && (
                      <div className="d-flex justify-content-between text-success">
                        <span>Discount ({discountPercent}%)</span>
                        <span className="fw-semibold">-${discountAmount}</span>
                      </div>
                    )}

                    <div className="d-flex justify-content-between text-muted">
                      <span>Estimated Shipping</span>
                      <span className="fw-semibold text-body">
                        {shippingCost === 0 ? (
                          <span className="text-success">FREE</span>
                        ) : (
                          `$${shippingCost}`
                        )}
                      </span>
                    </div>

                    <hr className="my-1" />

                    <div className="d-flex justify-content-between fs-5 fw-bold">
                      <span>Total Amount</span>
                      <span className="text-primary">${grandTotal}</span>
                    </div>
                  </div>

                  {/* Promo Code Input */}
                  <Form onSubmit={handleApplyCoupon} className="mb-4">
                    <Form.Label className="small fw-semibold text-muted">
                      Have a Promo Code?
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Try: SAVE10 or SAVE20"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        className="rounded-start-pill text-uppercase shadow-none"
                      />
                      <Button
                        type="submit"
                        variant="dark"
                        className="rounded-end-pill px-3"
                      >
                        Apply
                      </Button>
                    </InputGroup>
                    {promoCode && (
                      <div className="mt-2 small text-success d-flex align-items-center gap-1">
                        <FaCheck /> Promo code <strong>{promoCode}</strong> active!
                      </div>
                    )}
                  </Form>

                  {/* Checkout Button */}
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setShowCheckoutModal(true)}
                    className="w-100 rounded-pill shadow d-flex align-items-center justify-content-center gap-2 py-3"
                  >
                    <FaLock size={14} />
                    <span>Proceed to Checkout</span>
                  </Button>

                  <div className="text-center mt-3 text-muted small">
                    <small>🔒 256-Bit SSL Encrypted & Secure Checkout</small>
                  </div>
                </Card>
              </Col>
            </Row>
          )}
        </Tab>

        {/* API Carts Explorer Tab (Demonstrates DummyJSON Carts CRUD & inspection) */}
        <Tab
          eventKey="api-carts"
          title={
            <span>
              <FaReceipt className="me-1" />
              API Carts Explorer ({apiCarts?.length || 0})
            </span>
          }
        >
          <Card
            className={`border-0 shadow-sm rounded-4 p-4 ${
              isDark ? "bg-dark text-white border-secondary" : "bg-white"
            }`}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h5 className="fw-bold mb-1">DummyJSON Carts Data</h5>
                <p className="text-muted small mb-0">
                  Live response fetched from <code>https://dummyjson.com/carts</code>
                </p>
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => dispatch(fetchApiCarts())}
                className="rounded-pill"
              >
                Refresh API Carts
              </Button>
            </div>

            {apiLoading ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <Table responsive hover className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Cart ID</th>
                    <th>User ID</th>
                    <th>Total Products</th>
                    <th>Total Quantity</th>
                    <th>Total Price</th>
                    <th>Discounted Total</th>
                  </tr>
                </thead>
                <tbody>
                  {apiCarts?.slice(0, 8).map((cart) => (
                    <tr key={cart.id}>
                      <td className="fw-bold">Cart #{cart.id}</td>
                      <td>
                        <Badge bg="secondary">User #{cart.userId}</Badge>
                      </td>
                      <td>{cart.totalProducts} items</td>
                      <td>{cart.totalQuantity} units</td>
                      <td className="fw-semibold">${cart.total}</td>
                      <td className="text-success fw-bold">
                        ${cart.discountedTotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Tab>
      </Tabs>

      {/* Checkout Modal */}
      <Modal
        show={showCheckoutModal}
        onHide={() => setShowCheckoutModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            <FaLock className="text-primary me-2" />
            Complete Your Checkout
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCheckoutSubmit}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={12}>
                <h6 className="fw-bold border-bottom pb-2">Shipping Information</h6>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={shippingDetails.fullName}
                    onChange={(e) =>
                      setShippingDetails({
                        ...shippingDetails,
                        fullName: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Phone Number *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={shippingDetails.phone}
                    onChange={(e) =>
                      setShippingDetails({
                        ...shippingDetails,
                        phone: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">Delivery Address *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={shippingDetails.address}
                    onChange={(e) =>
                      setShippingDetails({
                        ...shippingDetails,
                        address: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-semibold">City *</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={shippingDetails.city}
                    onChange={(e) =>
                      setShippingDetails({
                        ...shippingDetails,
                        city: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={12} className="mt-4">
                <h6 className="fw-bold border-bottom pb-2">Payment Method</h6>
                <div className="d-flex flex-column gap-2 mt-2">
                  <Form.Check
                    type="radio"
                    id="pay-cod"
                    label={
                      <span className="d-flex align-items-center gap-2">
                        <FaMoneyBillWave className="text-success" />
                        Cash on Delivery (COD)
                      </span>
                    }
                    name="paymentMethod"
                    checked={shippingDetails.paymentMethod === "cod"}
                    onChange={() =>
                      setShippingDetails({
                        ...shippingDetails,
                        paymentMethod: "cod",
                      })
                    }
                  />
                  <Form.Check
                    type="radio"
                    id="pay-card"
                    label={
                      <span className="d-flex align-items-center gap-2">
                        <FaCreditCard className="text-primary" />
                        Credit / Debit Card (Online)
                      </span>
                    }
                    name="paymentMethod"
                    checked={shippingDetails.paymentMethod === "card"}
                    onChange={() =>
                      setShippingDetails({
                        ...shippingDetails,
                        paymentMethod: "card",
                      })
                    }
                  />
                </div>
              </Col>

              <Col md={12} className="mt-3">
                <div className="alert alert-light border d-flex justify-content-between align-items-center mb-0">
                  <span className="fw-semibold">Total Payable Amount:</span>
                  <span className="fs-5 fw-bold text-primary">${grandTotal}</span>
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCheckoutModal(false)}
              className="rounded-pill px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="rounded-pill px-4 shadow"
            >
              Confirm & Place Order
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Order Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
      >
        <Modal.Body className="text-center p-5">
          <div className="text-success display-3 mb-3">✓</div>
          <h3 className="fw-bold">Order Confirmed!</h3>
          <p className="text-muted">
            Thank you for shopping with us! Your order #
            {orderNumber} has been placed and will be delivered shortly.
          </p>
          <div className="d-flex justify-content-center gap-2 mt-4">
            <Button
              variant="primary"
              as={Link}
              to="/products"
              onClick={() => setShowSuccessModal(false)}
              className="rounded-pill px-4 shadow"
            >
              Continue Shopping
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
