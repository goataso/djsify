const GetButtonExmaple = (buttonCustomId: string | string[]) => `import { ButtonInteraction } from 'discord.js';

export default {
  data: {
    customId: "${buttonCustomId}"
  },
  async execute(interaction: ButtonInteraction) {
    // Your code here
  }
};`;

export { GetButtonExmaple }; 