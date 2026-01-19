import { useState } from 'react';
import { X, Search, Truck } from 'lucide-react';
import { useUsers, useAssignRider } from '@/hooks';
import { Button, Input, LoadingScreen, Avatar } from '@/components/ui';

interface AssignRiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  type?: 'pickup' | 'delivery'; // usually delivery for now
}

export const AssignRiderModal = ({ isOpen, onClose, orderId, type = 'delivery' }: AssignRiderModalProps) => {
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useUsers({ 
    role: 'rider', 
    limit: 20 
  });
  
  const { mutate: assignRider, isPending: isAssigning } = useAssignRider();

  if (!isOpen) return null;

  const users = data?.users || [];
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssign = () => {
    if (!selectedRiderId) return;
    
    assignRider(
      { id: orderId, data: { riderId: selectedRiderId, type } }, 
      {
        onSuccess: () => {
           onClose();
           setSelectedRiderId(null);
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Truck className="w-5 h-5 text-neutral-500" />
            Assign Rider
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          <Input
            placeholder="Search rider name..."
            leftIcon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="space-y-2">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Available Riders</p>
            {isLoading ? (
               <div className="py-8"><LoadingScreen /></div>
            ) : filteredUsers.length === 0 ? (
               <p className="text-sm text-neutral-500 text-center py-4">No riders found</p>
            ) : (
               <div className="grid gap-2">
                 {filteredUsers.map(rider => (
                   <div 
                     key={rider._id}
                     className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                       selectedRiderId === rider._id 
                         ? 'border-primary-500 bg-primary-50' 
                         : 'border-neutral-200 hover:border-primary-200'
                     }`}
                     onClick={() => setSelectedRiderId(rider._id)}
                   >
                     <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600">
                       {rider.name.charAt(0)}
                     </div>
                     <div className="flex-1">
                       <p className="font-medium text-sm text-neutral-900">{rider.name}</p>
                       <p className="text-xs text-neutral-500">{rider.email}</p>
                     </div>
                     {selectedRiderId === rider._id && (
                       <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                     )}
                   </div>
                 ))}
               </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button 
            className="flex-1" 
            disabled={!selectedRiderId || isAssigning}
            isLoading={isAssigning}
            onClick={handleAssign}
          >
            Confirm Assignment
          </Button>
        </div>
      </div>
    </div>
  );
};
