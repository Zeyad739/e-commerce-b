import { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { FaBoxOpen, FaSave } from "react-icons/fa";

export default function ProductForm({ show, onHide, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState(() => ({
    title: initialData?.title || "",
    price: initialData?.price || "",
    discountPercentage: initialData?.discountPercentage || 0,
    category: initialData?.category || "beauty",
    stock: initialData?.stock ?? 20,
    brand: initialData?.brand || "",
    description: initialData?.description || "",
    thumbnail: initialData?.thumbnail || "",
  }));

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Product title is required";
    if (!formData.price || Number(formData.price) <= 0) errs.price = "Valid price is required";
    if (!formData.description.trim()) errs.description = "Description is required";
    if (formData.stock < 0) errs.stock = "Stock cannot be negative";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...formData,
      price: Number(formData.price),
      discountPercentage: Number(formData.discountPercentage),
      stock: Number(formData.stock),
      id: initialData?.id,
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold d-flex align-items-center gap-2">
          <FaBoxOpen className="text-primary" />
          {initialData ? "Edit Product" : "Add New Product"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-4">
          <Row className="g-3">
            {/* Title */}
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Product Title *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Wireless Noise Cancelling Headphones"
                  value={formData.title}
                  isInvalid={Boolean(errors.title)}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            {/* Price & Discount */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Price ($) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  placeholder="29.99"
                  value={formData.price}
                  isInvalid={Boolean(errors.price)}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Discount Percentage (%)</Form.Label>
                <Form.Control
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  placeholder="10"
                  value={formData.discountPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, discountPercentage: e.target.value })
                  }
                />
              </Form.Group>
            </Col>

            {/* Category & Brand */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Category *</Form.Label>
                <Form.Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="text-capitalize"
                >
                  <option value="beauty">Beauty</option>
                  <option value="fragrances">Fragrances</option>
                  <option value="furniture">Furniture</option>
                  <option value="groceries">Groceries</option>
                  <option value="home-decoration">Home Decoration</option>
                  <option value="kitchen-accessories">Kitchen Accessories</option>
                  <option value="laptops">Laptops</option>
                  <option value="mens-shirts">Men's Shirts</option>
                  <option value="mens-shoes">Men's Shoes</option>
                  <option value="mens-watches">Men's Watches</option>
                  <option value="mobile-accessories">Mobile Accessories</option>
                  <option value="motorcycle">Motorcycle</option>
                  <option value="skin-care">Skin Care</option>
                  <option value="smartphones">Smartphones</option>
                  <option value="sports-accessories">Sports Accessories</option>
                  <option value="sunglasses">Sunglasses</option>
                  <option value="tablets">Tablets</option>
                  <option value="tops">Tops</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="womens-bags">Women's Bags</option>
                  <option value="womens-dresses">Women's Dresses</option>
                  <option value="womens-jewellery">Women's Jewellery</option>
                  <option value="womens-shoes">Women's Shoes</option>
                  <option value="womens-watches">Women's Watches</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Brand</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Apple, Nike, L'Oreal"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </Form.Group>
            </Col>

            {/* Stock & Thumbnail URL */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Stock Quantity</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  placeholder="50"
                  value={formData.stock}
                  isInvalid={Boolean(errors.stock)}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">{errors.stock}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Thumbnail Image URL</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://..."
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                />
              </Form.Group>
            </Col>

            {/* Description */}
            <Col md={12}>
              <Form.Group>
                <Form.Label className="small fw-semibold">Description *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Detailed description of the product..."
                  value={formData.description}
                  isInvalid={Boolean(errors.description)}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} className="rounded-pill px-4">
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="rounded-pill px-4 shadow">
            <FaSave className="me-1" />
            {initialData ? "Save Changes" : "Create Product"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
