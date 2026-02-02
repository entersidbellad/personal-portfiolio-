import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Content from './pages/Content';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout showSphere={true}>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/content"
          element={
            <Layout showSphere={false}>
              <Content />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
