import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLp } from "../apis/lp"; 

interface LpAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LpAddModal = ({ isOpen, onClose }: LpAddModalProps) => {
  const queryClient = useQueryClient();
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", content: "" });
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (newCard: any) => postLp(newCard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      handleClose();
      alert("LP가 성공적으로 등록되었습니다!");
    },
    onError: (error) => {
      alert("등록에 실패했습니다.");
      console.error(error);
    }
  });

  const handleClose = () => {
    setImagePreview(null);
    setFormData({ name: "", content: "" });
    setTags([]);
    onClose();
  };

const handleSubmit = () => {
  if (!formData.name.trim() || !formData.content.trim()) {
    return alert("내용을 입력해주세요.");
  }

  mutate({
    title: formData.name,       
    content: formData.content,  
    thumbnail: imagePreview || "",
    published: true, 
    tags: tags,
  });
};

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={(e) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) handleClose();
    }}>
      <div ref={modalRef} className="relative w-[90%] max-w-md bg-[#2C2C2E] rounded-2xl p-8 shadow-2xl">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

        <div className="flex flex-col items-center">
          <div onClick={() => fileInputRef.current?.click()} className="w-32 h-32 mb-6 rounded-full bg-zinc-800 border-2 border-dashed border-gray-500 flex items-center justify-center cursor-pointer overflow-hidden">
            {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <span className="text-gray-400">+</span>}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />

          <div className="w-full space-y-3">
            <input 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="LP Name" className="w-full bg-[#3A3A3C] rounded-lg p-3 text-white outline-none" 
            />
            <input 
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="LP Content" className="w-full bg-[#3A3A3C] rounded-lg p-3 text-white outline-none" 
            />
            
            <div className="flex gap-2">
              <input 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="LP Tag" className="flex-1 bg-[#3A3A3C] rounded-lg p-3 text-white outline-none" 
              />
              <button onClick={addTag} className="bg-gray-600 px-4 rounded-lg text-white">Add</button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 bg-gray-600 text-white px-3 py-1 rounded-full text-sm">
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-black">✕</button>
                </span>
              ))}
            </div>
          </div>

          <button 
            disabled={isPending}
            onClick={handleSubmit}
            className={`w-full mt-8 py-3 rounded-lg font-bold transition-all ${isPending ? 'bg-gray-500' : 'bg-[#A0A4B8] hover:bg-white text-[#2C2C2E]'}`}
          >
            {isPending ? "Adding..." : "Add LP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LpAddModal;