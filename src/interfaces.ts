export interface Project {
    id: number;
    name: string;
    description: string;
    user_id: number;
    completed: boolean | null;
}

export interface ProjectInput {
    name: string;
    description: string;
    token: string;
}

export interface Tag { 
    id: number;
    name: string;
    colorHash: string;
    user_id: number;
}

export interface Task { 
    id: number;
    description: string;
    project_id: number;
    blocked_task: number | null; // TODO make this optional
    tags: Tag | undefined;
    completed: boolean | null;
}

export interface TaskResponse { 
    id: number;
    description: string;
    project_id: number;
    blocked_task: number; // TODO make this optional
    tag_id: number;
}

export interface Subtask {
    id : number;
    task_id: number;
    description: string;
    completed: boolean | null;
}

