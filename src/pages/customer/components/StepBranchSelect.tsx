import { useState, useEffect } from 'react';
import { Card, Button, Spinner, Badge } from '@/components/ui';
import { MapPin, Star, Navigation } from 'lucide-react';
import { branchesService } from '@/services/branches.service';
import type { Branch } from '@/types/branch.types';
import toast from 'react-hot-toast';

interface StepBranchSelectProps {
    selectedBranchId: string;
    onSelect: (id: string) => void;
}

export const StepBranchSelect = ({ selectedBranchId, onSelect }: StepBranchSelectProps) => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [isDetecting, setIsDetecting] = useState(false);

    const fetchBranches = async (lat?: number, lng?: number) => {
        try {
            setIsLoading(true);
            const data = await branchesService.getAll({ isActive: true, lat, lng });
            setBranches(data);
        } catch (error) {
            toast.error('Failed to load branches');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation not supported');
            return;
        }

        setIsDetecting(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoords({ lat: latitude, lng: longitude });
                fetchBranches(latitude, longitude);
                setIsDetecting(false);
                toast.success('Location detected! Sorting branches by distance.');
            },
            () => {
                setIsDetecting(false);
                toast.error('Location access denied');
            }
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="bg-muted p-6 rounded-xl border border-border">
                    <h3 className="font-semibold text-foreground mb-4">Select a Branch</h3>
                    <p className="text-sm text-muted-foreground">Choose where your order should be processed</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDetectLocation}
                    isLoading={isDetecting}
                    className="text-primary border-primary/20 hover:bg-primary/10"
                >
                    <Navigation className="w-4 h-4 mr-2" />
                    Find Near Me
                </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12"><Spinner /></div>
            ) : (
                <div className="grid gap-4">
                    {branches.map((branch) => (
                        <Card
                            key={branch._id}
                            onClick={() => onSelect(branch._id)}
                            className={`p-4 cursor-pointer transition-all border-2 bg-card ${selectedBranchId === branch._id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/30'
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className={`p-3 rounded-xl ${branch.is_featured ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground/60'}`}>
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-foreground">{branch.name}</h4>
                                            {branch.is_featured && (
                                                <Badge variant="warning" className="text-[10px] py-0 px-2 flex items-center gap-1 bg-warning/10 text-warning border-warning/20">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    FEATURED
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{branch.address.street}, {branch.address.area}</p>
                                        <div className="mt-2 flex items-center gap-4 text-xs font-medium">
                                            <span className="text-muted-foreground">{branch.address.city}</span>
                                            {branch.operatingHours?.monday?.isOpen && (
                                                <span className="text-success">Open Now</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {selectedBranchId === branch._id && (
                                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
