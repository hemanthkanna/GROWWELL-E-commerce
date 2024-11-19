import { Fragment } from "react";
import MetaData from "./layouts/MetaData";
import ProductList from "./ProductList";

const Home = () => {
  return (
    <Fragment>
      <MetaData title={"Buy Best products"} />
      <div> Welcome</div>
      <ProductList />
    </Fragment>
  );
};

export default Home;
