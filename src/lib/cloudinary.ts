const CLOUD_NAME = "dnep5isuf";
const UPLOAD_PRESET = "amarkgc_uploads";

export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const getOptimizedUrl = (publicId: string, width = 1200) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto,w_${width}/${publicId}`;

export const uploadToCloudinary = async (
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ url: string; publicId: string }> => {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("ফাইলের সাইজ ৫MB এর বেশি হতে পারবে না।");
  }

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", CLOUDINARY_UPLOAD_URL);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve({ url: data.secure_url, publicId: data.public_id });
      } else {
        reject(new Error("আপলোড ব্যর্থ হয়েছে।"));
      }
    };

    xhr.onerror = () => reject(new Error("নেটওয়ার্ক সমস্যা।"));
    xhr.send(formData);
  });
};
