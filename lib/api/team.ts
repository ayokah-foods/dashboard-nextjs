import axios from "@/app/lib/axios";
import { TeamResponse } from "@/types/TeamType";

export async function listInvites({
    limit,
    offset,
    search,
}: {
    limit?: number;
    offset?: number;
    search?: string;
}) {
    const response = await axios.get<TeamResponse>(
        `/admin-stats?limit=${limit ?? ""}&offset=${offset ?? ""}&search=${search ?? ""}`
    );
    return response.data;
}




export async function sendInvite(data: {
  name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
}) {
  const response = await axios.post("/admin-invite", data);
  return response.data;
}

export async function deleteAdmin(id: number) {
  const response = await axios.delete(`/admin/${id}/delete`);
  return response.data;
}