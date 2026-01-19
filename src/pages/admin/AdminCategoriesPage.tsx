import { useState } from 'react';
import { Plus, Edit, Trash2, Tag, Search, Filter } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Card, Button, Input, Badge, LoadingScreen, EmptyState } from '@/components/ui';
import { useCategories, useDeleteCategory } from '@/hooks/useCategories';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export const AdminCategoriesPage = () => {
    const [search, setSearch] = useState('');
    const { data, isLoading } = useCategories();
    const { mutate: deleteCategory } = useDeleteCategory();

    const categories = data?.categories || [];

    const filteredCategories = categories.filter(category => 
        category.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            deleteCategory(id);
        }
    };

    if (isLoading) return <LoadingScreen />;

    return (
        <PageWrapper 
            title="Categories" 
            description="Manage service categories"
            action={
                <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => toast('Create/Edit Modal coming soon')}>
                    Add Category
                </Button>
            }
        >
            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <Input 
                        placeholder="Search categories..." 
                        leftIcon={<Search className="w-4 h-4" />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="md:max-w-sm"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="grid gap-4">
                {filteredCategories.length === 0 ? (
                    <Card variant="bordered" className="py-12">
                        <EmptyState
                            title="No categories found"
                            description="Create a new category to get started"
                        />
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCategories.map((category) => (
                            <Card key={category._id} variant="bordered" className="group flex flex-col h-full">
                                {category.imageUrl && (
                                    <div className="h-32 w-full bg-neutral-100 rounded-t-lg overflow-hidden mb-4 relative">
                                        <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                                        {!category.isActive && (
                                            <div className="absolute top-2 right-2">
                                                <Badge variant="error" size="sm">Inactive</Badge>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className={`${category.imageUrl ? 'px-4 pb-4' : 'p-4'} flex-1 flex flex-col`}>
                                    {!category.imageUrl && (
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                                                <Tag className="w-5 h-5" />
                                            </div>
                                            {!category.isActive && <Badge variant="error" size="sm">Inactive</Badge>}
                                        </div>
                                    )}
                                    
                                    <div className="mb-2">
                                        <h3 className="font-semibold text-lg text-neutral-900">{category.name}</h3>
                                        <p className="text-sm text-neutral-500 line-clamp-2">{category.description}</p>
                                    </div>

                                    <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                                        <span>Added {formatDate(category.createdAt)}</span>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => toast('Edit coming soon')}
                                                className="p-1 hover:bg-neutral-100 rounded text-neutral-500 transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(category._id)}
                                                className="p-1 hover:bg-error-50 rounded text-error-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};
