import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePostCrop } from "@/queries/crop/usePostCrop";

const CropRegister = () => {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const { mutate } = usePostCrop();

  const [form, setForm] = useState({
    cropName: "",
    cropDesc: "",
    cropPrice: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { farmId: Number(farmId), ...form, cropPrice: Number(form.cropPrice) },
      { onSuccess: () => navigate("/namu/my-farm-list") }
    );
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">농작물 등록</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="cropName" placeholder="농작물 이름" onChange={handleChange} className="border p-2 rounded" />
        <textarea name="cropDesc" placeholder="농작물 설명" onChange={handleChange} className="border p-2 rounded" />
        <input name="cropPrice" type="number" placeholder="가격" onChange={handleChange} className="border p-2 rounded" />
        <button type="submit" className="bg-green-500 text-white py-2 rounded">등록</button>
      </form>
    </div>
  );
};

export default CropRegister;
