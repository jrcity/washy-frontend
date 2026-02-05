import { useState } from 'react';
import { Upload, Image, FileText, File, Trash2, Search, Filter, RefreshCw, X, Eye } from 'lucide-react';
import { PageWrapper } from '@/components/layout';
import { Card, Button, Input, Select, Badge, LoadingScreen, EmptyState } from '@/components/ui';
import { uploadsService } from '@/services/uploads.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate, formatBytes } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export const AdminUploadsPage = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [isUploading, setIsUploading] = useState(false);

    // Fetch uploads
    const { data, isLoading } = useQuery({
        queryKey: ['uploads', categoryFilter],
        queryFn: () => uploadsService.getAll({
            category: categoryFilter === 'all' ? undefined : categoryFilter
        })
    });



    const uploads = data?.data.uploads || [];

    // Filter locally for search (if backend doesn't support search yet)
    const filteredUploads = uploads.filter(upload =>
        upload.filename.toLowerCase().includes(search.toLowerCase()) ||
        upload.originalName.toLowerCase().includes(search.toLowerCase())
    );

    // Upload mutation
    const uploadMutation = useMutation({
        mutationFn: uploadsService.upload,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['uploads'] });
            toast.success('File uploaded successfully');
            setIsUploading(false);
        },
        onError: () => {
            toast.error('Failed to upload file');
            setIsUploading(false);
        }
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: uploadsService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['uploads'] });
            toast.success('File deleted');
        },
        onError: () => toast.error('Failed to delete file')
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            await uploadMutation.mutateAsync({
                file,
                category: 'general', // Ensure 'general' is in UploadCategory type
            });
        } catch (err) {
            // Error handled in mutation
        }
    };

    const getFileIcon = (mimetype: string) => {
        if (mimetype.startsWith('image/')) return <Image className="w-5 h-5 text-purple-500" />;
        if (mimetype.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
        return <File className="w-5 h-5 text-blue-500" />;
    };

    if (isLoading) return <LoadingScreen />;

    return (
        <PageWrapper
            title="File Manager"
            description="Manage system uploads and assets"
            showBack={true}
            action={
                <div className="relative">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                        <Button
                            leftIcon={isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            disabled={isUploading}
                            className="pointer-events-none"
                            type="button"
                        >
                            {isUploading ? 'Uploading...' : 'Upload File'}
                        </Button>
                    </label>
                </div>
            }
        >
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <Input
                        placeholder="Search files..."
                        leftIcon={<Search className="w-4 h-4" />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select
                    label=""
                    options={[
                        { value: 'all', label: 'All Categories' },
                        { value: 'profile_picture', label: 'Profile Pictures' },
                        { value: 'service_image', label: 'Service Images' },
                        { value: 'delivery_proof', label: 'Delivery Proofs' },
                        { value: 'general', label: 'General' },
                    ]}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-48"
                />
            </div>

            {/* Content */}
            {filteredUploads.length === 0 ? (
                <Card variant="bordered" className="py-12">
                    <EmptyState
                        icon={<File className="w-10 h-10 text-neutral-300" />}
                        title="No files found"
                        description={search ? "Try adjusting your search" : "Upload your first file to get started"}
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredUploads.map((file) => (
                        <Card key={file._id} className="group relative overflow-hidden hover:shadow-md transition-shadow">
                            {/* Preview Area */}
                            <div className="aspect-[4/3] bg-neutral-100 flex items-center justify-center relative overflow-hidden rounded-t-lg">
                                {file.mimetype.startsWith('image/') ? (
                                    <img
                                        src={file.url}
                                        alt={file.originalName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-neutral-400">
                                        {getFileIcon(file.mimetype)}
                                        <span className="text-xs uppercase font-bold">{file.extension}</span>
                                    </div>
                                )}

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <a
                                        href={file.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition-colors"
                                        title="View"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </a>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this file?')) {
                                                deleteMutation.mutate(file._id);
                                            }
                                        }}
                                        className="p-2 bg-red-500/80 hover:bg-red-600 rounded-full text-white backdrop-blur-sm transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-3">
                                <h4 className="font-medium text-sm text-neutral-900 truncate mb-1" title={file.originalName}>
                                    {file.originalName}
                                </h4>
                                <div className="flex items-center justify-between text-xs text-neutral-500">
                                    <span>{formatBytes(file.size)}</span>
                                    <span>{formatDate(file.createdAt)}</span>
                                </div>
                                <div className="mt-2">
                                    <Badge variant="secondary" className="text-[10px] py-0.5 px-2">
                                        {file.category.replace('_', ' ')}
                                    </Badge>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </PageWrapper>
    );
};

export default AdminUploadsPage;
