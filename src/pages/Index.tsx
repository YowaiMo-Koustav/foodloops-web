
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { 
  Leaf, 
  ShoppingCart, 
  TrendingDown, 
  Users, 
  Recycle,
  Store,
  Clock,
  DollarSign
} from 'lucide-react';
import { useUser } from '@civic/auth-web3/react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: TrendingDown,
      title: "Smart Discounts",
      description: "AI-powered pricing that adjusts based on expiry dates for maximum savings"
    },
    {
      icon: Clock,
      title: "Live Updates",
      description: "Real-time inventory and pricing updates from local stores"
    },
    {
      icon: Users,
      title: "Community Sharing",
      description: "Share recipes, tips, and connect with eco-conscious food lovers"
    },
    {
      icon: Recycle,
      title: "Eco Impact Tracking",
      description: "Monitor your environmental impact and food waste reduction"
    }
  ];

  const stats = [
    { number: "50K+", label: "Food Items Saved", icon: ShoppingCart },
    { number: "2.3M", label: "CO₂ Reduced (kg)", icon: Leaf },
    { number: "15K+", label: "Happy Users", icon: Users },
    { number: "500+", label: "Partner Stores", icon: Store }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200">
              🌱 Reducing Food Waste, One Meal at a Time
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Welcome to FoodLoops
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Discover amazing deals on near-expiry foods while making a positive impact on the environment. 
              Join thousands of conscious consumers saving money and reducing food waste.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                onClick={() => navigate('/dashboard')}
                className="btn-brass text-lg px-8 py-6"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
              
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="outline"
                size="lg"
                className="rounded-xl px-8 py-6 text-lg border-amber-300 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
              >
                Browse Products
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="glass-card text-center p-6 hover:scale-105 transition-all duration-300">
                <CardContent className="p-0">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 icon-gold" />
                  <div className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-gray-200">
              Why Choose FoodLoops?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform combines smart technology with community spirit to create a sustainable food ecosystem.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card p-6 hover:scale-105 transition-all duration-300">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 icon-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <Card className="p-12 bg-brass-gradient border-none text-white text-center">
            <CardContent className="p-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join FoodLoops today and start your journey towards sustainable shopping.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  size="lg"
                  className="bg-white text-amber-600 hover:bg-gray-50 rounded-xl px-8 py-6 text-lg font-semibold"
                >
                  Join as Buyer
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10 rounded-xl px-8 py-6 text-lg"
                >
                  <Store className="w-5 h-5 mr-2" />
                  Become a Seller
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
