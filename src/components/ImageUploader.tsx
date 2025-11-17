import { useState } from "react";

const ImageUploader = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    const input = document.getElementById("imageInput") as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploadedUrl(data.imageUrl);
  };

  return (
    <div>
      <h2>이미지 업로드</h2>
      <input
        type="file"
        id="imageInput"
        accept="image/*"
        onChange={handleFileChange}
      />
      {preview && (
        <img
          src={preview}
          alt="미리보기"
          style={{ width: "200px", marginTop: "1rem" }}
        />
      )}
      <button onClick={handleUpload}>업로드</button>
      {uploadedUrl && (
        <div>
          <p>업로드 완료!</p>
          <img
            src={`http://localhost:5000${uploadedUrl}`}
            alt="업로드된 이미지"
            style={{ width: "200px" }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
