export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
}

export interface ComponentExample {
  name: string;
  args: Record<string, unknown>;
}

export interface ComponentMeta {
  name: string;
  category: string;
  description?: string;
  importPath: string;
  props: ComponentProp[];
  variants: string[];
  sizes: string[];
  accessibility: string[];
  examples: ComponentExample[];
}
