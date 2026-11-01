export interface Task {
     id : string;
      todo :  string;
      state :  string;
      closed : boolean;
      userId :  string
}

export interface CreateTaskRequest {
  todo: string;
  state: string;
  closed: boolean;
  userId: string;
}