import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle, XCircle, CreditCard, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface LoanApplication {
  id: string;
  loan_amount: number;
  employment_type: string;
  monthly_income: string;
  age_group: string;
  city: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  created_at: string;
}

interface KYCStatus {
  status: 'pending' | 'completed' | 'under_review' | 'approved' | 'rejected';
}

const LoanStatus = () => {
  const [loanApplication, setLoanApplication] = useState<LoanApplication | null>(null);
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) return;

      // Fetch loan application
      const { data: loanData } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      // Fetch KYC status
      const { data: kycData } = await supabase
        .from('kyc_status')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setLoanApplication(loanData?.[0] as LoanApplication || null);
      setKycStatus(kycData as KYCStatus || null);
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
      case 'under_review':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'under_review':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="loading-pulse w-12 h-12 rounded-lg"></div>
      </div>
    );
  }

  if (!loanApplication && !kycStatus) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="card-modern w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CreditCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Welcome to QuickCash</h2>
            <p className="text-muted-foreground mb-6">
              Start your loan application to get instant financial assistance.
            </p>
            <Button 
              onClick={() => navigate('/')} 
              className="btn-modern w-full"
            >
              Start Application
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Loan Dashboard</h1>
          <p className="text-muted-foreground">Track your loan application status</p>
        </div>

        {/* KYC Status Card */}
        {kycStatus && (
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                KYC Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(kycStatus.status)}
                  <div>
                    <p className="font-medium">Document Verification</p>
                    <p className="text-sm text-muted-foreground">
                      {kycStatus.status === 'approved' 
                        ? 'Your documents have been verified successfully'
                        : kycStatus.status === 'under_review'
                        ? 'Your documents are being reviewed'
                        : 'Complete your KYC verification'
                      }
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(kycStatus.status)}>
                  {kycStatus.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              {kycStatus.status === 'pending' && (
                <Button 
                  onClick={() => navigate('/kyc')} 
                  variant="outline" 
                  className="mt-4"
                >
                  Complete KYC
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Loan Application Status */}
        {loanApplication && (
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Loan Application
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Overview */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20">
                <div className="flex items-center gap-3">
                  {getStatusIcon(loanApplication.status)}
                  <div>
                    <p className="font-medium">Application Status</p>
                    <p className="text-sm text-muted-foreground">
                      {loanApplication.status === 'approved' 
                        ? 'Congratulations! Your loan has been approved'
                        : loanApplication.status === 'under_review'
                        ? 'Your application is being reviewed by our team'
                        : loanApplication.status === 'rejected'
                        ? 'Unfortunately, your application was not approved'
                        : 'Your application is in queue for review'
                      }
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(loanApplication.status)}>
                  {loanApplication.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              {/* Application Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Loan Amount</label>
                    <p className="text-xl font-bold text-primary">
                      {formatAmount(loanApplication.loan_amount)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Employment Type</label>
                    <p className="font-medium">{loanApplication.employment_type}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Monthly Income</label>
                    <p className="font-medium">{loanApplication.monthly_income}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Age Group</label>
                    <p className="font-medium">{loanApplication.age_group}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">City</label>
                    <p className="font-medium">{loanApplication.city}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Applied On</label>
                    <p className="font-medium">
                      {new Date(loanApplication.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {loanApplication.status === 'approved' && (
                  <Button className="btn-modern flex-1">
                    Proceed to Disbursal
                  </Button>
                )}
                {loanApplication.status === 'rejected' && (
                  <Button 
                    onClick={() => navigate('/')} 
                    variant="outline" 
                    className="flex-1"
                  >
                    Apply Again
                  </Button>
                )}
                <Button 
                  onClick={() => navigate('/platform-fee')} 
                  variant="outline"
                >
                  View Charges
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => navigate('/eligible-apps')} 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
              >
                <FileText className="h-6 w-6" />
                <span>Eligible Apps</span>
              </Button>
              <Button 
                onClick={() => navigate('/platform-fee')} 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
              >
                <CreditCard className="h-6 w-6" />
                <span>Platform Fee</span>
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
              >
                <AlertCircle className="h-6 w-6" />
                <span>New Application</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoanStatus;