import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ProductDetail = () => {
    const [product, setProduct] = useState(null)
    const { id } = useParams()

    useEffect(() => {
        fetch(`http://localhost:3000/product/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))
            .catch(error => console.error("data not fetched", error))
    }, [id])

    if (!product) return <div className='text-center'>Loading...</div>
    return (
        <>
            <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <p className="text-xl text-green-600 font-semibold mb-2">₹{product.price}</p>
                <p className="text-gray-700 mb-2">{product.description}</p>
                <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                <p className="text-sm text-gray-500">Category: {product.category}</p>
            </div>
        </>
    )
}

export default ProductDetail