import Head from 'next/head';

const Index = () => {
  return (
    <div>
      <Head>
        <title>Home Page</title>
      </Head>
      <div className="container mt-5">
        <h1 className="text-center text-primary">This is home page</h1>
        <p className="lead text-center">
          Welcome to our beautiful homepage styled with custom CSS!
        </p>
        <div className="text-center">
          <button className="btn btn-primary">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default Index;