interface ITemplateVariable {
  [key: string]: string | number;
}

export default interface IParseMailTemplateDto {
  file: string;
  variables: ITemplateVariable;
}
