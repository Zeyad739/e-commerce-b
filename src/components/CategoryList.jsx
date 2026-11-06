import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import {
  fetchCategories,
  setSelectedCategory,
  fetchProducts,
} from "../store/Slices/productsSlice";
import {
  FaThLarge,
  FaMobileAlt,
  FaLaptop,
  FaSprayCan,
  FaHeartbeat,
  FaShoppingBag,
  FaHome,
  FaTshirt,
  FaShoePrints,
  FaClock,
} from "react-icons/fa";

// Category icon helper
const getCategoryIcon = (categorySlug) => {
  const slug = typeof categorySlug === "string" ? categorySlug.toLowerCase() : "";
  if (slug.includes("smartphones") || slug.includes("mobile")) return <FaMobileAlt className="me-1" />;
  if (slug.includes("laptop") || slug.includes("computer")) return <FaLaptop className="me-1" />;
  if (slug.includes("fragrance") || slug.includes("beauty")) return <FaSprayCan className="me-1" />;
  if (slug.includes("skin") || slug.includes("health")) return <FaHeartbeat className="me-1" />;
  if (slug.includes("furniture") || slug.includes("home")) return <FaHome className="me-1" />;
  if (slug.includes("shirt") || slug.includes("cloth") || slug.includes("dress") || slug.includes("tops"))
    return <FaTshirt className="me-1" />;
  if (slug.includes("shoe")) return <FaShoePrints className="me-1" />;
  if (slug.includes("watch")) return <FaClock className="me-1" />;
  return <FaShoppingBag className="me-1" />;
};

export default function CategoryList({ activeCategory, onSelectCategory }) {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.products);
  const isDark = useSelector((state) => state.theme.isDark);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  const handleSelect = (slug) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    } else {
      dispatch(setSelectedCategory(slug));
      dispatch(fetchProducts({ category: slug, skip: 0 }));
    }
  };

  // Standardize category items from DummyJSON (can be strings or {slug, name, url})
  const categoryItems = Array.isArray(categories)
    ? categories.map((cat) => {
        if (typeof cat === "string") {
          return { slug: cat, name: cat.replace(/-/g, " ") };
        }
        return { slug: cat.slug || cat.name, name: cat.name || cat.slug };
      })
    : [];

  return (
    <div className="category-scroll-container py-2 mb-3">
      <div className="d-flex align-items-center gap-2 overflow-x-auto pb-2 flex-nowrap custom-scrollbar">
        {/* All Products pill */}
        <Button
          variant={
            !activeCategory || activeCategory === "all"
              ? "primary"
              : isDark
              ? "outline-light"
              : "outline-secondary"
          }
          size="sm"
          className="rounded-pill px-3 py-2 text-nowrap d-flex align-items-center fw-medium text-capitalize shadow-sm"
          onClick={() => handleSelect("all")}
        >
          <FaThLarge className="me-1" />
          All Categories
        </Button>

        {categoryItems.map((cat) => {
          const isSelected = activeCategory === cat.slug;
          return (
            <Button
              key={cat.slug}
              variant={
                isSelected
                  ? "primary"
                  : isDark
                  ? "outline-light"
                  : "outline-secondary"
              }
              size="sm"
              className="rounded-pill px-3 py-2 text-nowrap d-flex align-items-center fw-medium text-capitalize shadow-sm"
              onClick={() => handleSelect(cat.slug)}
            >
              {getCategoryIcon(cat.slug)}
              {cat.name}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
