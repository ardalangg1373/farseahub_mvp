import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="w-full border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/logoasli1373.png"
            alt="FarsiHub"
            style={{ height: 36 }}
          />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/marketplace" className="text-sm font-medium hover:underline">
            Marketplace
          </Link>
          <Link to="/tourism" className="text-sm font-medium hover:underline">
            Tourism
          </Link>
          <Link to="/dating" className="text-sm font-medium hover:underline">
            Dating
          </Link>
          <Link to="/metaverse" className="text-sm font-medium hover:underline">
            Metaverse
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-2">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;


