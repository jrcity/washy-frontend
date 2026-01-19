import { useState, useEffect } from 'react';
import { User, Lock, Bell, Home } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Card, Input } from '@/components/ui';
import { PageWrapper } from '@/components/layout';
import { useAuthContext } from '@/context/AuthContext';
import { updateProfile } from '@/services/auth.service';
import toast from 'react-hot-toast';
import { RiderProfileForm } from '@/components/profile/RiderProfileForm';

export const ProfilePage = () => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'general' | 'preferences' | 'security'>('general');
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    area: ''
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
        area: user.address?.area || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          city: formData.city,
          state: formData.state,
          area: formData.area
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
    { id: 'general', label: 'General', icon: User },
    // { id: 'preferences', label: 'Preferences', icon: Bell }, // TODO: Implement if API ready
    // { id: 'security', label: 'Security', icon: Lock },
  ] as const;

  return (
    <PageWrapper title="Settings" description="Manage your account preferences">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <Card className="p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                  activeTab === tab.id 
                    ? 'bg-primary-50 text-primary-700' 
                    : 'text-neutral-600 hover:bg-neutral-50'
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
            {activeTab === 'general' && (
              <form onSubmit={onUpdateProfile} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">Personal Information</h3>
                  <p className="text-sm text-neutral-500 mb-6">Update your personal details and address.</p>
                  
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
                        className="bg-neutral-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-neutral-100">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Address Details</h3>
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

                <div className="pt-6 border-t border-neutral-100">
                  <div className="flex justify-end">
                    <Button type="submit" isLoading={isLoading}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </Card>

          {/* Role Specific Details */}
          {activeTab === 'general' && user?.role === 'rider' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">Rider Details</h3>
              <p className="text-sm text-neutral-500 mb-6">Manage your vehicle and bank information.</p>
              <RiderProfileForm />
            </Card>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};
