import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Star, 
  Filter, 
  Search,
  TrendingUp,
  Clock,
  Users,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { ReviewForm } from '@/components/Reviews/ReviewForm';
import { ReviewCard } from '@/components/Reviews/ReviewCard';
import { 
  Review, 
  getAllReviews, 
  getReviewsByCategory, 
  getRecentReviews, 
  getTopReviews,
  getGlobalStats,
  submitReview,
  voteReviewHelpful,
  reportReview
} from '@/integrations/aptos/client';
import { useUser } from '@civic/auth-web3/react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/Layout/DashboardLayout';

const CATEGORIES = [
  'all',
  'restaurant',
  'grocery',
  'delivery',
  'cafe',
  'bakery',
  'farmers-market',
  'food-truck',
  'other'
];

const ReviewsPage = () => {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Load reviews on component mount
  useEffect(() => {
    loadReviews();
    loadGlobalStats();
  }, []);

  // Filter reviews when category or search changes
  useEffect(() => {
    filterReviews();
  }, [reviews, selectedCategory, searchQuery]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      let fetchedReviews: Review[] = [];
      
      switch (activeTab) {
        case 'recent':
          fetchedReviews = await getRecentReviews(20);
          break;
        case 'top':
          fetchedReviews = await getTopReviews(20);
          break;
        default:
          fetchedReviews = await getAllReviews();
      }
      
      setReviews(fetchedReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const loadGlobalStats = async () => {
    try {
      const stats = await getGlobalStats();
      setGlobalStats(stats);
    } catch (error) {
      console.error('Error loading global stats:', error);
    }
  };

  const filterReviews = () => {
    let filtered = reviews;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(review => review.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(review => 
        review.title.toLowerCase().includes(query) ||
        review.comment.toLowerCase().includes(query) ||
        review.category.toLowerCase().includes(query)
      );
    }

    setFilteredReviews(filtered);
  };

  const handleSubmitReview = async (rating: number, title: string, comment: string, category: string) => {
    if (!user) {
      toast.error('Wallet not connected');
      return;
    }

    setIsSubmitting(true);
    try {
      // @ts-ignore
      await submitReview(user.wallet.address, rating, title, comment, category);
      await loadReviews(); // Reload reviews
      await loadGlobalStats(); // Reload stats
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (reviewId: string) => {
    if (!user) {
      toast.error('Wallet not connected');
      return;
    }

    try {
      // @ts-ignore
      await voteReviewHelpful(user.wallet.address, parseInt(reviewId));
      await loadReviews(); // Reload reviews
      toast.success('Vote recorded!');
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
    }
  };

  const handleReport = async (reviewId: string) => {
    if (!user) {
      toast.error('Wallet not connected');
      return;
    }

    try {
      // @ts-ignore
      await reportReview(user.wallet.address, parseInt(reviewId));
      await loadReviews(); // Reload reviews
      toast.success('Review reported');
    } catch (error) {
      console.error('Error reporting:', error);
      toast.error('Failed to report review');
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    loadReviews();
  };

  return (
    <DashboardLayout
      title="Reviews & Feedback"
      description="See what others are saying and share your own experiences."
    >
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community Reviews</h1>
          <p className="text-muted-foreground">
            Share your experiences and help others discover great food waste reduction initiatives
          </p>
        </div>

        {/* Global Stats */}
        {globalStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Reviews</p>
                    <p className="text-2xl font-bold">{globalStats.total_reviews || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">{globalStats.total_users || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                    <p className="text-2xl font-bold">
                      {globalStats.average_rating ? parseFloat(globalStats.average_rating).toFixed(1) : '0.0'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Categories</p>
                    <p className="text-2xl font-bold">{globalStats.categories?.length || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Review Submission Form */}
          <div className="lg:col-span-1">
            <ReviewForm onSubmit={handleSubmitReview} isLoading={isSubmitting} categories={CATEGORIES.slice(1)} />
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>All Reviews</CardTitle>
                  <div className="flex items-center gap-4">
                    {/* Search Input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search reviews..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    {/* Category Filter */}
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="top">Top Rated</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-4">
                    {isLoading ? <p>Loading...</p> : (
                      <div className="space-y-4">
                        {filteredReviews.map(review => (
                          <ReviewCard key={review.id} review={review} onVote={handleVote} onReport={handleReport} />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="recent" className="mt-4">
                     {isLoading ? <p>Loading...</p> : (
                      <div className="space-y-4">
                        {filteredReviews.map(review => (
                          <ReviewCard key={review.id} review={review} onVote={handleVote} onReport={handleReport} />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="top" className="mt-4">
                     {isLoading ? <p>Loading...</p> : (
                      <div className="space-y-4">
                        {filteredReviews.map(review => (
                          <ReviewCard key={review.id} review={review} onVote={handleVote} onReport={handleReport} />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReviewsPage; 