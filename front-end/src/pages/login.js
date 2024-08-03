import Head from 'next/head';

const Login = () => {
  return (
    <div>
      <Head>
        <title>Login Page</title>
      </Head>
      <div className="container">
        <div className="login-container">
          <h1 className="text-center">Login</h1>
          <form>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input type="password" className="form-control" id="password" placeholder="Password" />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
