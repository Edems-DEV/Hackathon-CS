import { IAutomationType } from "./IAutomationType";

export interface IAutomation {
  id: string;
  last_activity: string;
  state: string;
  type: string;
  sas: string;
  type_object?: IAutomationType;
}
