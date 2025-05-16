// src/pages/ProductListPage.jsx

import React from "react";
import ProductList from "../components/ProductList";
import PageLoader from '../components/Common/PageLoader';

const ProductListPage = () => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Simulate fetching product data
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="p-6">
      {loading ? (
        <PageLoader 
          title="Loading Products" 
          subtitle="Please wait while we fetch product data..."
        />
      ) : (
        <ProductList />
      )}
    </div>
  );
};

export default ProductListPage;
