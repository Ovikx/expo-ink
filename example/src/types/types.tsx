export interface User {
  id: string;
  name: string;
  age: number;
  verified: boolean;
}

export interface Post {
  id: string;
  title: string;
  timePosted: number;
}
