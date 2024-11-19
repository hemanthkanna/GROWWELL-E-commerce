import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import NotFound from "./components/layouts/NotFound";
import Header from "./components/layouts/Header";
import { HelmetProvider } from "react-helmet-async";
// import ProductList from "./components/ProductList";
import Footer from "./components/layouts/Footer";

function App() {
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {/* common components */}
      <HelmetProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/products" element={<ProductList />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </HelmetProvider>
    </div>
  );
}

export default App;
