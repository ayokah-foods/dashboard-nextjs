"use client";

import React, { useEffect, useState } from "react";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import toast from "react-hot-toast";
import { getPolicy, savePolicy } from "@/app/api_/settings";

interface PolicyEditorProps {
  type: string;
}

export default function PolicyEditor({ type }: PolicyEditorProps) {
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await getPolicy(type);
        setContent(response?.data?.content || "");
      } catch (error) {
        console.error("Error fetching policy:", error);
      }
    };

    fetchPolicy();
  }, [type]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("content", content);

    try {
      await savePolicy(formData);
      toast.success("Policy saved successfully!");
    } catch {
      toast.error("Something went wrong while saving settings!");
    }
  };

  return (
    <div className="p-0 space-y-2">
      <TinyMCEEditor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        value={content}
        init={{
          height: 500,
          menubar: false,
          plugins: "link lists code",
          toolbar:
            "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | code",
        }}
        onEditorChange={(newValue) => setContent(newValue)}
      />
      <div className="mt-8 border-t border-gray-200 pt-5">
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleSave}
            className="bg-orange-600 inline-flex items-center cursor-pointer justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-orange-700"
          >
            Save {type}
          </button>
        </div>
      </div>

    </div>
  );
}
