import React, { useState, useEffect } from 'react';
import { rbacService } from '@/services/rbac.service';
import type { Policy } from '@/types/rbac.types';
import { Shield, Plus, Trash2, Edit2, GripVertical } from 'lucide-react';
import Button from '@/components/ui/Button';

export const AdminRBACPage: React.FC = () => {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        try {
            const response = await rbacService.getPolicies();
            if (response.success) {
                setPolicies(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch policies', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this policy?')) {
            try {
                await rbacService.deletePolicy(id);
                fetchPolicies();
            } catch (error) {
                console.error('Failed to delete policy', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Access Control</h1>
                    <p className="text-gray-600">Manage roles, permissions, and security policies</p>
                </div>
                <Button onClick={() => { }} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Policy
                </Button>
            </div>

            <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading policies...</div>
                ) : policies.length === 0 ? (
                    <div className="p-12 text-center">
                        <Shield className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No Policies Defined</h3>
                        <p className="text-gray-500 mt-1">Start by creating a new security policy.</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Policy Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Roles
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Resources
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Effect
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {policies.map((policy) => (
                                <tr key={policy._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Shield className="w-5 h-5 text-gray-400 mr-3" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                                                <div className="text-sm text-gray-500">{policy.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1">
                                            {policy.roles.map((role) => (
                                                <span key={role} className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {policy.resources.join(', ')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${policy.effect === 'allow'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {policy.effect.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(policy._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminRBACPage;
