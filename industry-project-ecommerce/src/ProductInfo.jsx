import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useRoute } from 'wouter';
import axios from 'axios';
import { useCart } from "./CartAtom";



export default function ProductInfo() {

    const [info, setInfo] = useState("");
    const [stock, setStock] = useState(0);
    const [dimension, setDimension] = useState({});

    const [match, params] = useRoute('/products/:id');
    const id = `${params.id}`;

    const {cartInfo, addToCart, getCartQty } = useCart();

    const displayDimension = () => {

        let fullString = "";

        if (dimension.pd_height != null) {
            fullString = fullString + `${dimension.pd_height}cm(H)`
        }
        if (dimension.pd_width != null) {
            fullString = fullString + ` x ${dimension.pd_width}cm(W)`
        }
        if (dimension.pd_depth != null) {
            fullString = fullString + ` x ${dimension.pd_depth}cm(D)`
        }
        if (dimension.pd_diameter != null || dimension.pd_circumference != null) {

            if (dimension.pd_diameter != null) {
                fullString = fullString + `, ${dimension.pd_diameter}cm(Diameter)`
            }
            if (dimension.pd_circumference != null) {
                fullString = fullString + `, ${dimension.pd_circumference}cm(Cirumference)`
            }
        }

        return (fullString)
    }


    const [count, setCounter] = useState(0);

    //This is the addCart function
    // on click update the session immediately. 

    const minusCart = () => {
        
        if (count > 0) {
            const newCount = count - 1;
            setCounter(newCount);
            handleCart(info, newCount); 
        }
    };

    const addCart = () => {

        if (count < stock) {
            const newCount = count + 1;
            setCounter(newCount);
            handleCart(info, newCount); 
        }
        

    };

    const handleCart = (product, currentQty) => {

        if (!product || !product.product_id) return; // Avoid adding undefined products
        const existingProduct = cartInfo.find(i => i.product_id === product.product_id);
    
        addToCart({
            "product_id": product.product_id,
            "product_name": product.product_name,
            "product_quantity": currentQty,
            "price": product.product_price,
            "product_image": product.product_image,
            "product_dimension": displayDimension(),
            "product_category": product.category_name,
            "product_series": product.product_series
        })
    }




    useEffect(() => {

        if (id) {
            const fetchInfo = async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${params.id}`);
                    setInfo(response.data);
                    setStock(response.data.product_stock);
                    setDimension(response.data.dimension[0]); // Assuming there's only one dimension object
                    setCounter(getCartQty(response.data.product_id));

                }
                catch (error) {
                    console.error("Error Fetching in frontend: ", error);
                }
            };

            fetchInfo();

        }
    }, [id]);

    useEffect(() => {
        if (info && info.product_id) {
            // handleCart(info, count);
            console.log(cartInfo);
        }
    }, [count, info]);


    return (
        <>
            <Navbar type="text-black" />
            <div className="container-fluid p-5 vh-100">
                <div className="container h-100 pt-5">
                    <div className="row d-flex productInfo-top justify-content-center">
                        <div className="col-12 col-lg-5 position-relative">
                            <div className="productInfo-photo" style={{ backgroundImage: `url(${info.product_image}` }}>
                            </div>
                            <div className="productInfo-description pt-5">
                                <div className="font-700">Product Details</div>
                                <div className="productInfo-writeup">
                                    {info.product_description}                      </div>
                            </div>
                        </div>
                        <div className="col-lg-6 d-flex">
                            <div className="sticky-top my-auto ps-lg-5">
                                <div>
                                    <div className="productInfo-category">{info.product_series}, {info.category_name}</div>
                                    <div className="w-100 d-flex flex-wrap">
                                        <div className="productInfo-name header-text sectionTitle font-3rem ">{info.product_name}<span className="material-symbols-outlined text-center display-block p-1 like-icon ">
                                            heart_plus
                                        </span></div>
                                    </div>
                                    <div className="productInfo-price header-text w-100 sectionTitle">${info.product_price}</div>
                                </div>
                                <div className="pt-5">
                                    <div className="font-700">Dimensions</div>
                                    <div className="productInfo-dimension">
                                        {displayDimension()}
                                        <div className="productInfo-addToCart pt-5 position-relative">
                                            <div className="col-5 d-flex productInfo-button justify-content-between">
                                                {count == 0 ? (
                                                    <>
                                                        {stock == 0 ? (
                                                            <>
                                                                <div className="button text-center w-100 addToCart h-100 disabled">Out Of Stock</div>

                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="button text-center w-100 addToCart h-100" onClick={() => { addCart() }}>Add to Cart</div>
                                                            </>
                                                        )}

                                                    </>

                                                ) : (
                                                    <>
                                                        <div className="productInfo-Minus px-2" onClick={() => { minusCart() }}>-</div>
                                                        <div className="productInfo-Quantity">{count}</div>
                                                        <div className={`productInfo-Add px-2 ${count == stock ? "disabled" : ""}`} onClick={() => { addCart() }}>+</div>
                                                    </>
                                                )}

                                            </div>
                                            {/* <div className="productInfo-availablity ">
                                            {count >= stock ? {

                                            }
                                            }
                                            </div> */}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}