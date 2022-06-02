// Parameters specified in the jsPsych plugin 'info' attribute.
declare type Info = {
  prompt: string;
  responses: { value: string, key: string, correct: boolean }[];
  style: "default" | "radio";
  inputTimeout: number;
  confirm: boolean;
};

declare type Trial = {
  type: string;
} & Info;
