// src/index.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import { CouponProvider } from "./contexts/CouponContext";
import { FAQProvider } from "./contexts/FAQContext";
import { TagProvider } from "./contexts/TagContext";
import { ReviewProvider } from "./contexts/ReviewContext";
import { BlogProvider } from "./contexts/BlogContext"; // Import BlogProvider
import { ProductProvider } from "./contexts/ProductContext"; // Import ProductProvider
import { OrderProvider } from "./contexts/OrderContext"; // Import OrderProvider
import { BrowserRouter as Router } from "react-router-dom";
import ErrorBoundary from "./components/Common/ErrorBoundary";
import "../src/styles/globals.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      {/* <ErrorBoundary> */}
      <AuthProvider>
        <UserProvider>
          <CategoryProvider>
            <CouponProvider>
              <FAQProvider>
                <TagProvider>
                  <ReviewProvider>
                    <BlogProvider>
                      {" "}
                      {/* Existing BlogProvider */}
                      <ProductProvider>
                        {" "}
                        {/* Added ProductProvider */}
                        <OrderProvider>
                          {" "}
                          {/* Wrap with OrderProvider */}
                          <AppRoutes />
                        </OrderProvider>
                      </ProductProvider>
                    </BlogProvider>
                  </ReviewProvider>
                </TagProvider>
              </FAQProvider>
            </CouponProvider>
          </CategoryProvider>
        </UserProvider>
      </AuthProvider>
      {/* </ErrorBoundary> */}
    </Router>
    <Toaster position="top-right" reverseOrder={false} />
  </React.StrictMode>
);
