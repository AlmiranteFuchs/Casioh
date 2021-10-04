interface CommandInterface {
  name: string;
  aliases?: string[];
  options?: Option[];

  onCommand(args: string[]): string;
}

interface Option {
  name: string;
  parameters: number;
  aliases?: string[];
}

export { CommandInterface, Option };
