import { RESTPostAPIApplicationGuildCommandsJSONBody, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from "discord.js";

type SlashType = RESTPostAPIApplicationGuildCommandsJSONBody | SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
export default SlashType;