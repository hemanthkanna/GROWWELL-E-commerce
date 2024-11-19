import { fetchProducts } from "@/actions/productsAction";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ProductList = () => {
  const dispatch = useDispatch();
  const { loading, products, error } = useSelector((state) => state.products);
  const [selectedWeight, setSelectedWeight] = useState({});

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleWeightChange = (productId, weight) => {
    // Find the product and the price for the selected weight
    const product = products.find((prod) => prod._id === productId);
    const selectedPrice = product.prices.find((p) => p.weight === weight);

    // Set the selected weight's price and stock
    setSelectedWeight({
      productId,
      weight,
      price: selectedPrice.price,
      offerPrice: selectedPrice.offerPrice,
      stock: selectedPrice.stock,
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product._id} className="product-card">
          <img
            src={product.images[0].image}
            alt={product.productName}
            className="product-image"
          />
          <div className="product-info">
            <h2 className="product-name">{product.productName}</h2>
            <p className="category">Category: {product.category}</p>
            <p className="seller">Seller: {product.seller}</p>
            <div className="ratings">
              <p>Rating: {product.ratings} ⭐</p>
              <p>Reviews: {product.numOfReviews}</p>
            </div>

            <div className="price-range">
              <h3>Price Range:</h3>
              {product.prices.map((price) => (
                <button
                  key={price._id}
                  onClick={() => handleWeightChange(product._id, price.weight)}
                  className={`price-btn ${
                    selectedWeight.productId === product._id &&
                    selectedWeight.weight === price.weight
                      ? "active"
                      : ""
                  }`}
                >
                  {price.weight}
                </button>
              ))}
            </div>

            {selectedWeight.productId === product._id &&
            selectedWeight.weight ? (
              <div className="price-info">
                <p>Selected Weight: {selectedWeight.weight}</p>
                <p>
                  Price: ₹
                  {selectedWeight.offerPrice ? (
                    <span>
                      <strike>{selectedWeight.price}</strike> ₹
                      {selectedWeight.offerPrice}
                    </span>
                  ) : (
                    selectedWeight.price
                  )}
                </p>
                <p>Stock Available: {selectedWeight.stock}</p>
              </div>
            ) : (
              <div>Please select a weight</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
