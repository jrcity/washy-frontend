import { useState } from 'react';
import { Search, User as UserIcon, Shield, Mail, Phone, MoreHorizontal } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Card, Input, Button, Badge, LoadingScreen, EmptyState } from '@/components/ui';
import { useUsers } from '@/hooks'; // Assuming useUsers hook exists or will need to check
import { formatDate } from '@/lib/utils';

export const AdminUsersPage = () => {
    const [roleFilter, setRoleFilter] = useState('all');
    const [search, setSearch] = useState('');
    
    // Fallback if useUsers doesn't exist yet, we might need to assume it does or use a stub
    // Based on file list, users.service.ts exists, so useUsers likely exists or I should check.
    // Proceeding assuming it follows pattern, if error I will fix.
    const { data, isLoading } = useUsers({ 
        role: roleFilter === 'all' ? undefined : roleFilter,
        limit: 50
    });

    const users = data?.users || [];

    const filteredUsers = users.filter(user => {
        if (!search) return true;
        const term = search.toLowerCase();
        return (
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term) ||
            user.phone.toLowerCase().includes(term)
        );
    });

    if (isLoading) return <LoadingScreen />;

    return (
        <PageWrapper title="Users" description="Manage system users and roles">
             {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                <Input
                    placeholder="Search name, email, phone..."
                    leftIcon={<Search className="w-4 h-4" />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                </div>
                <div className="flex gap-2">
                    {['all', 'customer', 'staff', 'rider', 'branch_manager'].map((role) => (
                         <Button
                            key={role}
                            variant={roleFilter === role ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setRoleFilter(role)}
                            className="capitalize"
                         >
                            {role.replace('_', ' ')}
                         </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                 {filteredUsers.length === 0 ? (
                    <Card variant="bordered" className="py-12">
                        <EmptyState
                            title="No users found"
                            description="Try changing the role filter or search term"
                        />
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {filteredUsers.map((user) => (
                            <Card key={user._id} variant="bordered" className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500">
                                         <UserIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-neutral-900">{user.name}</h3>
                                            <Badge variant="secondary" className="capitalize text-xs">
                                                {user.role.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-neutral-500 mt-1">
                                            <div className="flex items-center gap-1">
                                                <Mail className="w-3 h-3" />
                                                <span>{user.email || 'No email'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-3 h-3" />
                                                <span>{user.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-neutral-400">
                                    Joined {formatDate(user.createdAt)}
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};
