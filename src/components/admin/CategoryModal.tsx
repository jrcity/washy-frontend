import { useState, useEffect, useRef } from 'react';
import { Tag, Upload, X } from 'lucide-react';
import { Button, Input, Modal, Switch } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useCreateCategory, useUpdateCategory, useUploadCategoryImage } from '@/hooks/useCategories';
import type { Category } from '@/types';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category?: Category | null; // null = create mode, Category = edit mode
}

export const CategoryModal = ({ isOpen, onClose, category }: CategoryModalProps) => {
    const isEditMode = !!category;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isActive: true,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
    const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
    const { mutate: uploadImage, isPending: isUploading } = useUploadCategoryImage();

    const isLoading = isCreating || isUpdating || isUploading;

    // Reset form when modal opens/closes or category changes
    useEffect(() => {
        if (isOpen && category) {
            setFormData({
                name: category.name,
                description: category.description || '',
                isActive: category.isActive,
            });
            setImagePreview(category.imageUrl || null);
        } else if (isOpen) {
            setFormData({ name: '', description: '', isActive: true });
            setImagePreview(null);
        }
        setImageFile(null);
    }, [isOpen, category]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditMode && category) {
            updateCategory(
                { id: category._id, data: formData },
                {
                    onSuccess: (response) => {
                        // Upload image if new one was selected
                        if (imageFile) {
                            uploadImage({ id: category._id, image: imageFile }, {
                                onSuccess: () => onClose()
                            });
                        } else {
                            onClose();
                        }
                    }
                }
            );
        } else {
            // Generate slug from name
            const slug = formData.name
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '');

            createCategory({ ...formData, slug }, {
                onSuccess: (response) => {
                    // If image was selected, upload it after creation
                    // Note: response.data should contain the new category with _id
                    if (imageFile && response?.data?._id) {
                        uploadImage({ id: response.data._id, image: imageFile }, {
                            onSuccess: () => onClose()
                        });
                    } else {
                        onClose();
                    }
                }
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? 'Edit Category' : 'Add Category'}
            icon={<Tag className="w-5 h-5 text-neutral-500" />}
            size="md"
            footer={
                <>
                    <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        className="flex-1"
                        onClick={handleSubmit}
                        isLoading={isLoading}
                    >
                        {isEditMode ? 'Save Changes' : 'Create Category'}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Category Image
                    </label>
                    <div
                        className="border-2 border-dashed border-neutral-200 rounded-xl p-4 text-center cursor-pointer hover:border-primary-300 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {imagePreview ? (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setImageFile(null);
                                        setImagePreview(null);
                                    }}
                                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-neutral-100"
                                >
                                    <X className="w-4 h-4 text-neutral-600" />
                                </button>
                            </div>
                        ) : (
                            <div className="py-4">
                                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                                <p className="text-sm text-neutral-500">Click to upload image</p>
                            </div>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>

                {/* Name */}
                <Input
                    label="Category Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Dry Cleaning"
                    required
                />

                {/* Description */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-neutral-700 ml-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Brief description of this category..."
                        rows={3}
                        className={cn(
                            "w-full px-4 py-3 bg-white border border-neutral-200 rounded-2xl text-base transition-all duration-300 resize-none",
                            "focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 focus:outline-none",
                            "hover:border-neutral-300 hover:shadow-sm"
                        )}
                    />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center pt-2 ml-1">
                    <Switch
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        label="Category is active and visible"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default CategoryModal;
