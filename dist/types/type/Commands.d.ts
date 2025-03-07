import { ButtonInteraction, Client, CommandInteraction, Message, OmitPartialGroupDMChannel } from "discord.js";
import djsClient from "../Client/setup.js";
type TypedClient = Client & {
    djsClient?: djsClient;
};
type SlashCommandInteraction = CommandInteraction & {
    djsClient?: djsClient;
    client?: TypedClient;
};
type ButtoncommandInteraction = ButtonInteraction & {
    djsClient?: djsClient;
    client?: TypedClient;
};
type MessageInteraction = OmitPartialGroupDMChannel<Message> & {
    djsClient?: djsClient;
    client?: TypedClient;
};
export type { SlashCommandInteraction, ButtoncommandInteraction, MessageInteraction };
