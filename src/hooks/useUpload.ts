import { useMutation } from '@tanstack/react-query';
import { uploadsService } from '@/services/uploads.service';
import toast from 'react-hot-toast';

export const useUpload = () => {
    return useMutation({
        mutationFn: uploadsService.upload,
        onError: (error: any) => {
            toast.error(error.message || 'Failed to upload file');
        }
    });
};
