import './ProductList.style.css'

import ProductPreview from './ProductPreview.jsx'
import React from 'react'

export default class ProductList extends React.Component {
  render() {
    return (
      <div className='app__product-list'>
        <h3>Products</h3>
        <ul>
          {this.props.products.map((product) => {
            return (
              <li key={product.id}>
                <ProductPreview
                  id={product.id}
                  onClick={this.props.onClick}
                  {...product}
                />
              </li>
            )
          })}
        </ul>
        <p>
          <b>Tip</b>: Clicking the product will add it to the editor.
        </p>
      </div>
    )
  }
}
