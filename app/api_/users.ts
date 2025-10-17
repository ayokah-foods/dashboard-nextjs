import axios from "@/app/lib/axios";

export async function getRecentUsers(
  limit?: number,
  offset?: number,
  search?: string,
  type?: string
) {
  const response = await axios.get("/users", {
    params: { limit, offset, search, type },
  });
  return response.data;
}

export async function getUserOrder(
  limit?: number,
  offset?: number,
  search?: string,
  type?: string,
  userId?: string
) {
  const response = await axios.get(`/orders/user/${userId}`, {
    params: { limit, offset, search, type },
  });
  return response.data;
}

export async function getUserDetail(userId: string, type?: string) {
  const response = await axios.get(`/user/${userId}`, {
    params: type ? { type } : {},
  });
  return response.data;
}

export async function changeUserStatus(userId: string, isActive: boolean) {
  const response = await axios.patch(`/user/${userId}/status`, {
    is_active: isActive,
  });
  return response.data;
}

export async function userStats(customer?: string) {
  const response = await axios.get(`/user-stats`, {
    params: customer ? { type: customer } : {},
  });
  return response.data;
}

export async function getUserGraph(role?: string, selectedPeriod?: string) {
  const response = await axios.get("/user-graph", {
    params: { role, start_date: selectedPeriod },
  });
  return response.data;
}

export async function getActivityGraph(selectedPeriod?: string, role?: string) {
  const response = await axios.get("/user-activities-graph", {
    params: { role, start_date: selectedPeriod },
  });
  return response.data;
}

export async function getUserActivities(
  limit = 10,
  offset = 0,
  role = "customer"
) {
  const response = await axios.get("/user-activities", {
    params: {
      role,
      limit,
      offset,
    },
  });
  return response.data;
}

export async function deleteUser(userId: string) {
  const response = await axios.delete(`/users/${userId}`);
  return response.data;
}