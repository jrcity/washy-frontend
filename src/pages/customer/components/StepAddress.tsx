interface StepAddressProps {
  data: any;
  setData: (data: any) => void;
}

export const StepAddress = ({ data, setData }: StepAddressProps) => {
  // TODO: Fetch user addresses
  // For now, implementing simple date picker
  
  const timeSlots = [
    '09:00 - 11:00',
    '11:00 - 13:00',
    '13:00 - 15:00',
    '15:00 - 17:00',
    '17:00 - 19:00',
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pickup Date & Time */}
        <div className="space-y-4">
          <h3 className="font-semibold text-neutral-900">Pickup Schedule</h3>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Date</label>
            <input 
              type="date" 
              className="w-full rounded-lg border-neutral-300 focus:ring-primary-500 focus:border-primary-500"
              value={data.pickupDate}
              onChange={(e) => setData({ ...data, pickupDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Time Slot</label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setData({ ...data, pickupTimeSlot: slot })}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    data.pickupTimeSlot === slot
                      ? 'bg-primary-50 border-primary-500 text-primary-700'
                      : 'border-neutral-200 hover:border-primary-300'
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
          <h3 className="font-semibold text-neutral-900">Address</h3>
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 text-center">
             <p className="text-neutral-500 text-sm mb-2">You haven't added any addresses yet.</p>
             {/* Mocking an address for now since Profile isn't built */}
             <button 
               onClick={() => setData({ ...data, pickupAddressId: 'mock-addr-1', deliveryAddressId: 'mock-addr-1' })}
               className={`w-full p-3 rounded-lg border text-left flex items-start gap-3 transition-colors ${
                 data.pickupAddressId === 'mock-addr-1' ? 'bg-white border-primary-500 ring-2 ring-primary-100' : 'bg-white border-neutral-200'
               }`}
             >
               <div className="mt-1">🏠</div>
               <div>
                 <p className="font-medium text-neutral-900">Home</p>
                 <p className="text-sm text-neutral-500">123 Main St, Lagos</p>
               </div>
             </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Instructions / Notes</label>
            <textarea 
              className="w-full rounded-lg border-neutral-300 focus:ring-primary-500 focus:border-primary-500"
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
