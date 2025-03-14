"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetButtonExmaple = void 0;
const GetButtonExmaple = (buttonCustomId) => `import { ButtonInteraction } from 'discord.js';

export default {
  data: {
    customId: "${buttonCustomId}"
  },
  async execute(interaction: ButtonInteraction) {
    // Your code here
  }
};`;
exports.GetButtonExmaple = GetButtonExmaple;
