// src/components/Layout/Layout.js
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children, shopName }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header shopName={shopName} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};
