export interface TData {
  data: any;
  message: string;
  retcode: number;
  game: string;
}

export type TResultData = {
  id: string;
  username: string;
  discordUserId: string;
  data: TData[];
};

export type TUser = {
  id?: string;
  username: string;
  discordUserId: string;
  ltokenV2: string;
  ltuidV2: string;
};
