export type Gender = "Male" | "Female";

export interface Doctor {
  id: number;
  name: string;
  age: number;
  email: string;
  phone: string;
  gender: Gender;
  country: string;
  departmentId: number;
  weekOffDay: number; // 0-6
  currentShiftIndex: number; // 0 Morning,1 Evening,2 Night
}
