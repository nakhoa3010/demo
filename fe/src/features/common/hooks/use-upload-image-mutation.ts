import { axiosUploadClientInstance } from '@/lib/utils/api-upload-client';
import { useMutation } from '@tanstack/react-query';

const MAX_SIZE = 5 * 1024 * 1024; // 10MB

export default function useUploadImageMutation() {
  const { mutateAsync: uploadImage, isPending: isUploading } = useMutation({
    mutationFn: (image: File): Promise<string> => {
      if (image.size > MAX_SIZE) {
        throw new Error('image_size_too_large');
      }
      if (!image.type.startsWith('image/')) {
        throw new Error('invalid_image_type');
      }

      const dirName = 'default';
      const formData = new FormData();
      formData.append('image', image);
      return axiosUploadClientInstance.post(`/upload/image/${dirName}`, formData);
    },
  });

  return {
    uploadImage,
    isUploading,
  };
}
