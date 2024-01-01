import React, { useState, useEffect } from 'react';


const ProductDisplay = () => {
    const [products, setProducts] = useState([]);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://s3.amazonaws.com/open-to-cors/assignment.json");
        if (!response.ok) {
          throw new Error('Unable to fetch');
        }

        const result = await response.json();
        
        setProducts(Object.values(result.products));
      } catch (error) {
        console.log(error)
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="App">
      <h1>Amazon Data</h1>
      {products && (
        <table>
          <thead>
            <tr>
              <th>Subcategory</th>
              <th>Title</th>
              <th>Price</th>
              <th>Popularity</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.subcategory}</td>
                <td>{product.title}</td>
                <td>{product.price}</td>
                <td>{product.popularity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

};

export default ProductDisplay;
