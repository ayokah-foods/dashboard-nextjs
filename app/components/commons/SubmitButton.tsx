import React from 'react';
import { ClipLoader } from 'react-spinners'; 

type SubmitButtonProps = {
  label?: string;
  loading?: boolean;
};

export function SubmitButton({ label = 'Save changes', loading = false }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`w-full inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-bold rounded-md text-white cursor-pointer ${
        loading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-400 hover:bg-orange-600'
      }`}
    >
      {loading ? (
        <>
          <ClipLoader size={16} color="#fff" className="mr-2" />
          Processing...
        </>
      ) : (
        label
      )}
    </button>
  );
}
