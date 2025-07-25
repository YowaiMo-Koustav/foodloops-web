
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf,
  Sun,
  Moon,
  ShoppingCart,
  User
} from 'lucide-react';
import { useUser, UserButton } from '@civic/auth-web3/react';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import { WalletConnect } from './WalletConnect';

const Header = () => {
  const { user } = useUser();
  const { isDark, toggleTheme } = useTheme();
  const { items } = useCart();

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-amber-100 dark:border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/14ed19af-011f-47af-b644-a7d767331b87.png" 
              alt="FoodLoops Logo" 
              className="w-10 h-10 rounded-full"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              FoodLoops
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/dashboard" 
              className="text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link 
              to="/products" 
              className="text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-medium"
            >
              Products
            </Link>
            <Link 
              to="/community" 
              className="text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-medium"
            >
              Community
            </Link>
            <Link 
              to="/reviews" 
              className="text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-medium"
            >
              Reviews
            </Link>
            <Link 
              to="/profile" 
              className="text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-medium"
            >
              Profile
            </Link>
            {user && (user as any).user_type === 'seller' && (
              <Link 
                to="/seller" 
                className="text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors font-medium"
              >
                Sell
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="sm"
                className="relative text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400"
              >
                <ShoppingCart className="w-5 h-5 icon-gold" />
                {cartItemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Wallet Connection */}
            <WalletConnect />
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400"
            >
              {isDark ? <Sun className="w-4 h-4 icon-gold" /> : <Moon className="w-4 h-4 icon-gold" />}
            </Button>
            
            {/* Profile & Auth Button */}
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
