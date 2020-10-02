import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import React from "react";
import Stripe from "stripe";
import CheckoutButton from "../components/CheckoutButton";

import stripeConfig from "../config/stripe";

interface Props {
  product: Stripe.Product;
  price: Stripe.Price;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const stripe = new Stripe(stripeConfig.secretKey, {
    apiVersion: "2020-08-27",
  });

  const products = await stripe.products.list();

  const paths = products.data.map((product) => ({
    params: {
      productId: product.id,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const stripe = new Stripe(stripeConfig.secretKey, {
    apiVersion: "2020-08-27",
  });

  const { productId } = params;

  const price = await stripe.prices.retrieve("price_1HXfAGCngi05zWp5PERTBlzh");

  const product = await stripe.products.retrieve(productId as string);

  return {
    props: {
      product,
      price,
    },
  };
};

const Product: React.FC<Props> = ({ product, price }) => {
  return (
    <div>
      <h1>{product.name}</h1>

      <hr />

      {product.images && (
        <img
          style={{
            width: 200,
          }}
          src={product.images[0]}
        />
      )}

      <h2>
        {Number(price.unit_amount / 100).toFixed(2)}{" "}
        {price.currency.toUpperCase()}
      </h2>

      <CheckoutButton itemName={product.name} priceId={price.id} />
      <br />
      <br />
      <Link href="/">Go back</Link>
    </div>
  );
};

export default Product;
