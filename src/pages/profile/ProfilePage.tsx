import { useState, useEffect } from 'react';
import { User, Bell, CreditCard, Building2, MapPin } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Card, Input } from '@/components/ui';
import { PageWrapper } from '@/components/layout';
import { useAuthContext } from '@/context/AuthContext';
import { updateProfile } from '@/services/auth.service';
import { useGeolocation } from '@/hooks';
import toast from 'react-hot-toast';
import { RiderProfileForm } from '@/components/profile/RiderProfileForm';
import { ProfileNotificationPrefs } from '@/components/profile/ProfileNotificationPrefs';
import { ProfileBankInfo } from '@/components/profile/ProfileBankInfo';
import { ProfilePaymentSettings } from '@/components/profile/ProfilePaymentSettings';

type TabId = 'general' | 'notifications' | 'bank' | 'payments';

export const ProfilePage = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const { detectLocation, isLoading: isLocating } = useGeolocation();
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    area: '',
    landmark: ''
  });

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        area: user.address?.area || '',
        landmark: user.address?.landmark || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDetectLocation = async () => {
    const address = await detectLocation();
    if (address) {
      setFormData(prev => ({
        ...prev,
        ...address
      }));
    }
  };

  const onUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          area: formData.area,
          city: formData.city,
          state: formData.state,
          landmark: formData.landmark
        }
      });
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'general' as TabId, label: 'General', icon: User },
    { id: 'notifications' as TabId, label: 'Notifications', icon: Bell },
    { id: 'bank' as TabId, label: 'Bank Info', icon: Building2 },
    { id: 'payments' as TabId, label: 'Payments', icon: CreditCard },
  ];

  return (
    <PageWrapper title="Settings" description="Manage your account preferences" showBack={true}>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <Card className="p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${activeTab === tab.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          <Card className="p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <form onSubmit={onUpdateProfile} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Personal Information</h3>
                  <p className="text-sm text-muted-foreground mb-6">Update your personal details and address.</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    <div className="md:col-span-2">
                      <Input
                        label="Email Address"
                        value={formData.email}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">Address Details</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleDetectLocation}
                      className="text-primary border-primary/20 hover:bg-primary/10"
                      disabled={isLoading || isLocating}
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Detect Location
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Input
                        label="Street Address"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        placeholder="123 Main St"
                      />
                    </div>
                    <Input
                      label="Area"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="Downtown"
                    />
                    <Input
                      label="Nearby Landmark"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      placeholder="Near Barnawa Market"
                    />
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Lagos"
                    />
                    <Input
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Lagos State"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="flex justify-end">
                    <Button type="submit" isLoading={isLoading}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && <ProfileNotificationPrefs />}

            {/* Bank Info Tab */}
            {activeTab === 'bank' && <ProfileBankInfo />}

            {/* Payments Tab */}
            {activeTab === 'payments' && <ProfilePaymentSettings />}
          </Card>

          {/* Role Specific Details */}
          {activeTab === 'general' && user?.role === 'rider' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-1">Rider Details</h3>
              <p className="text-sm text-muted-foreground mb-6">Manage your vehicle and bank information.</p>
              <RiderProfileForm />
            </Card>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

