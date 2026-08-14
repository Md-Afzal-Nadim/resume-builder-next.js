import { Types } from "mongoose";

export interface IPersonalDetails {
  fullname: string;
  email: string;
  mobile: string;
  location: string;
  github: string;
  linkedIn: string;
  portfolio: string;
}

export interface IWorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface IProjects {
  title: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
  technologies: string[];
}

export interface IEducation {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface IResume {
  _id?: string;
  user_id: Types.ObjectId;
  title: string;
  summary: string;
  personalDetails: IPersonalDetails;
  workExperience: IWorkExperience[];
  projects: IProjects[];
  skills: string[];
  education: IEducation[];
  certificates?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}