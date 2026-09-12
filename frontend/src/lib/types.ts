export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
}
