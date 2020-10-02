import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { Stripe } from "stripe";
import stripeConfig from "../config/stripe";

interface Props {
  products: Stripe.Product[];
  price: Stripe.Price;
}

export const getStaticProps: GetStaticProps = async () => {
  const stripe = new Stripe(stripeConfig.secretKey, {
    apiVersion: "2020-08-27",
  });

  const products = await stripe.products.list();
  const price = await stripe.prices.retrieve("price_1HXfAGCngi05zWp5PERTBlzh");

  return {
    props: {
      products: products.data,
      price,
    },
  };
};

const Home: React.FC<Props> = ({ products, price }) => {
  return (
    <>
      <h1>Simple Stripe Store</h1>
      {products.map((product) => (
        <div key={product.id}>
          <h1>{product.name}</h1>

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

          <Link href={"/" + product.id}>Visit Page</Link>
          <hr />
        </div>
      ))}
    </>
  );
};

export default Home;
