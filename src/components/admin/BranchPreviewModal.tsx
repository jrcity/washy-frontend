import { Modal, Button, Badge } from '@/components/ui';
import type { Branch } from '@/types';
import { MapPin, Phone, User, Clock, CheckCircle, XCircle } from 'lucide-react';

interface BranchPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    branch: Branch | null;
}

export const BranchPreviewModal = ({ isOpen, onClose, branch }: BranchPreviewModalProps) => {
    if (!branch) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={branch.name}
            icon={<MapPin className="w-5 h-5 text-neutral-500" />}
            size="md"
            footer={
                <Button onClick={onClose} className="w-full">
                    Close
                </Button>
            }
        >
            <div className="space-y-6">
                {/* Status Banner */}
                <div className={`p-4 rounded-lg flex items-center justify-between ${branch.isActive ? 'bg-success-50 text-success-700' : 'bg-error-50 text-error-700'}`}>
                    <div className="flex items-center gap-2">
                        {branch.isActive ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        <span className="font-medium">{branch.isActive ? 'Branch is Active' : 'Branch is Inactive'}</span>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-medium text-neutral-500 mb-2">Location & Contact</h4>
                        <div className="bg-neutral-50 p-4 rounded-lg space-y-3">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-neutral-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-neutral-900">{branch.address.street}</p>
                                    <p className="text-sm text-neutral-600">{branch.address.city}, {branch.address.state}</p>
                                    <p className="text-xs text-neutral-400 mt-1">{branch.address.area}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-neutral-400" />
                                <span className="text-sm text-neutral-900">{branch.contactPhone}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-neutral-500 mb-2">Manager</h4>
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-neutral-900">Manager ID: {typeof branch.manager === 'string' ? branch.manager.substring(0, 8) + '...' : branch.manager?._id || 'N/A'}</p>
                                <p className="text-xs text-neutral-500">Branch Manager</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
