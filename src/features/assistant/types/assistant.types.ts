export type AssistantMessageRole = 'user' | 'assistant';

export type AssistantMessage = {
  id: string;
  role: AssistantMessageRole;
  content: string;
};

export type AssistantRequestMessage = Pick<AssistantMessage, 'role' | 'content'>;

export type AssistantRequest = {
  message: string;
  currentPath: string;
  history: AssistantRequestMessage[];
};

export type AssistantResponsePayload = {
  answer?: string;
  error?: string;
};

export type AssistantServiceResult =
  | {
      isSuccess: true;
      answer: string;
      isFallback: boolean;
    }
  | {
      isSuccess: false;
      message: string;
    };
