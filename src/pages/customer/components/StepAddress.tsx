import { useProfile } from '@/hooks/useAuth';
import type { User } from '@/types/auth.types';
import { Button, Spinner, Input } from '@/components/ui';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StepAddressProps {
  data: any;
  setData: (data: any) => void;
}

export const StepAddress = ({ data, setData }: StepAddressProps) => {
  const { data: user, isLoading } = useProfile();
  const navigate = useNavigate();

  const timeSlots = [
    '09:00 - 11:00',
    '11:00 - 13:00',
    '13:00 - 15:00',
    '15:00 - 17:00',
    '17:00 - 19:00',
  ];

  if (isLoading) return <div className="p-8 flex justify-center"><Spinner /></div>;

  const handleAddressSelect = () => {
    // If we had multiple addresses we'd show a list.
    // Since user object has a single address property, check if it exists.
    if (user?.address) {
      setData({
        ...data,
        pickupAddressId: user._id, // Using user ID as reference if backend expects simple ID, OR we pass full address later
        deliveryAddressId: user._id
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pickup Date & Time */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Pickup Schedule</h3>
          <div>
            <Input
              type="date"
              label="Date"
              value={data.pickupDate}
              onChange={(e) => setData({ ...data, pickupDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">Time Slot</label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setData({ ...data, pickupTimeSlot: slot })}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${data.pickupTimeSlot === slot
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'border-border bg-card text-foreground hover:border-primary/30'
                    }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Address</h3>
            <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/5" onClick={() => navigate('/dashboard/profile')}>
              Manage
            </Button>
          </div>

          {!user?.address ? (
            <div className="p-4 rounded-xl border border-dashed border-border bg-muted text-center">
              <p className="text-muted-foreground text-sm mb-3">No address found on profile.</p>
              <Button onClick={() => navigate('/profile')} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </div>
          ) : (
            <div
              onClick={handleAddressSelect}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-colors cursor-pointer ${
                // Auto-select logic if not selecting explicitly, or check if selected
                (data.pickupAddressId || user.address) ? 'bg-primary/10 border-primary ring-1 ring-primary' : 'bg-card border-border'
                }`}
            >
              <div className="mt-1 text-xl">🏠</div>
              <div>
                <p className="font-medium text-foreground">{user.name}'s Address</p>
                <p className="text-sm text-muted-foreground">
                  {user.address.street}, {user.address.area}{user.address.landmark ? ` (Near ${user.address.landmark})` : ''}, {user.address.city}
                </p>
              </div>

              <div className="ml-auto">
                <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">Instructions / Notes</label>
            <textarea
              className="w-full rounded-lg border-border bg-card text-foreground focus:ring-primary focus:border-primary transition-all duration-300"
              rows={3}
              placeholder="Gate code, landmark, etc."
              value={data.notes}
              onChange={(e) => setData({ ...data, notes: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
