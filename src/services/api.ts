import axios from "axios";
import { Department, Doctor, Shift, Roster } from "../models";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

/* ====== GENERIC CRUD ====== */

export const fetchAll = async <T>(endpoint: string): Promise<T[]> => {
  const res = await api.get<T[]>(`/${endpoint}`);
  return res.data;
};

export const createItem = async <T>(endpoint: string, data: T) => {
  const res = await api.post(`/${endpoint}`, data);
  return res.data;
};

export const updateItem = async <T>(endpoint: string, id: number, data: T) => {
  const res = await api.put(`/${endpoint}/${id}`, data);
  return res.data;
};

export const deleteItem = async (endpoint: string, id: number) => {
  await api.delete(`/${endpoint}/${id}`);
};
