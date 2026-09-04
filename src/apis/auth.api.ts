import axios from "axios";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  mobile: string
}

// Register

export const registerApi = async (payload: RegisterPayload) => {
  const response = await axios.post("/api/auth/register", payload);

  return response.data;
};

// Login

export const loginApi = async (payload: LoginPayload) => {
  const response = await axios.post("/api/auth/login", payload);

  return response.data;
};




// Get Profile
export const getProfileApi = async () => {
  const response = await axios.get("/api/profile", {
    withCredentials: true,
  });

  return response.data;
};



// Get All Resumes

/*export const getAllResumesApi = async () => {
  const response = await axios.get("/api/resume");
  return response.data;
};*/