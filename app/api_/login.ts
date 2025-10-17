import axios from "@/app/lib/axios"; 

export async function login(formData: FormData) {
  const response = await axios.post("/login", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });

  return response.data;
}

export async function changePassword(formData: FormData) {
  const token = localStorage.getItem("token");

  const response = await axios.post("/change-password", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}


export async function forgetPassword(formData: FormData) {
  const response = await axios.post("/forget-password", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });

  return response.data;
}

export async function confirmResetCode(formData: FormData) {
  const response = await axios.post("/confirm-reset-code", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });

  return response.data;
}

export async function resetPassword(formData: FormData) {
  const response = await axios.post("/reset-password", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });

  return response.data;
}