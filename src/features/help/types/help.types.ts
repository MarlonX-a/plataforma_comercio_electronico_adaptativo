export interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ContactMethod {
  id: string;
  name: string;
  description: string;
  value: string;
  icon: string;
  hoursLabel?: string;
}
